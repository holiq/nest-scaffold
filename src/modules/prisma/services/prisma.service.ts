import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '@prisma/client';
import { BaseFilter } from '@utils/base-class/base-filter';
import * as fs from 'fs-extra';

const extendedPrismaClient = () => {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL || '',
  });
  const prisma = new PrismaClient({ adapter });

  const applyDeletedAtToIncludes = (
    args: any,
    ignoreParanoids: string[] = [],
  ) => {
    if (args.include) {
      const transformJson = (input: any, path = '') => {
        const addDeletedAtCondition = (value: any, keyPath: string) => {
          if (typeof value === 'boolean') {
            if (!ignoreParanoids.includes(keyPath)) {
              return { where: { deletedAt: null } };
            }
          } else if (typeof value === 'object' && value !== null) {
            const newValue = { ...value };

            if (!ignoreParanoids.includes(keyPath)) {
              if (!newValue.where) {
                newValue.where = { deletedAt: null };
              } else {
                newValue.where = { deletedAt: null, ...newValue.where };
              }
            }

            if (newValue.include) {
              newValue.include = Object.fromEntries(
                Object.entries(newValue.include).map(([key, val]) => [
                  key,
                  addDeletedAtCondition(val, `${keyPath}.${key}`),
                ]),
              );
            }

            return newValue;
          }
          return value;
        };

        const result = {};
        for (const key in input) {
          result[key] = addDeletedAtCondition(
            input[key],
            path ? `${path}.${key}` : key,
          );
        }
        return result;
      };

      return transformJson(args.include);
    }
  };

  const deletedAtCache = new Map<string, boolean>();

  const hasDeletedAtColumn = (model: string): boolean => {
    if (deletedAtCache.has(model)) return deletedAtCache.get(model);

    // Read the schema file once and cache per model
    const schema = fs.readFileSync(
      process.cwd() + '/prisma/schema.prisma',
      'utf-8',
    );

    // Regular expression to find model blocks and their contents
    const modelRegex = new RegExp(`model\\s+${model}\\s+{([\\s\\S]*?)}`, 'g');
    const match = modelRegex.exec(schema);

    let result = false;
    if (match) {
      const modelContent = match[1]; // Extract the content of the model block

      // Check if the model has a `deletedAt` field
      const deletedAtRegex = /deletedAt\s+DateTime\??.*@map\("deleted_at"\)/;
      result = deletedAtRegex.test(modelContent);
    }

    deletedAtCache.set(model, result);
    return result;
  };

  const argsIgnoreParanoids = (args: any): string[] => {
    let argsArr: string[] = [];

    const ignoreParanoids: string[] = (args as any).ignoreParanoids;
    if (ignoreParanoids && ignoreParanoids.length) {
      argsArr = ignoreParanoids;
    }

    return argsArr;
  };

  const handleDeletedAt = ({ model, operation, args, query }) => {
    const hasDeletedAt = hasDeletedAtColumn(model);
    if (hasDeletedAt) {
      const ingoreParanoids = argsIgnoreParanoids(args);
      args.where = { deletedAt: null, ...args.where };
      (args as any).include = applyDeletedAtToIncludes(args, ingoreParanoids);
    }

    // Delete unused parameters
    delete args['ignoreParanoids'];

    return query(args);
  };

  return prisma.$extends({
    client: {
      async onModuleInit() {
        await Prisma.getExtensionContext(this).$connect();
      },
    },
    query: {
      $allModels: {
        async findFirst({ model, operation, args, query }) {
          return handleDeletedAt({ model, operation, args, query });
        },
        async findFirstOrThrow({ model, operation, args, query }) {
          return handleDeletedAt({ model, operation, args, query });
        },
        async findMany({ model, operation, args, query }) {
          return handleDeletedAt({ model, operation, args, query });
        },
        async findUnique({ model, operation, args, query }) {
          return handleDeletedAt({ model, operation, args, query });
        },
        async findUniqueOrThrow({ model, operation, args, query }) {
          return handleDeletedAt({ model, operation, args, query });
        },
        async count({ model, operation, args, query }) {
          return handleDeletedAt({ model, operation, args, query });
        },
      },
    },
    model: {
      $allModels: {
        async softDelete<T>(
          this: T,
          where: Prisma.Args<T, 'findFirst'>['where'],
        ) {
          const context = Prisma.getExtensionContext(this);
          return await (context as any).updateMany({
            data: { deletedAt: new Date(Date.now()).toISOString() },
            where: { deletedAt: null, ...where },
          });
        },
        async countFilter<
          T,
          K extends BaseFilter<Prisma.Args<T, 'findFirst'>['where'], any>,
        >(this: T, filter: K) {
          // Delete unused parameters
          delete filter['include'];
          delete filter['skip'];
          delete filter['take'];

          const context = Prisma.getExtensionContext(this);
          return await (context as any).count(filter);
        },
      },
    },
  });
};

const ExtendedPrismaClient = class {
  constructor() {
    return extendedPrismaClient();
  }
} as new () => ReturnType<typeof extendedPrismaClient>;

@Injectable()
export class PrismaService extends ExtendedPrismaClient {}
