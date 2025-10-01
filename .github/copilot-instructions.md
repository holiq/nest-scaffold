# Copilot Instructions for nest-scaffold

## Architecture Overview

Enterprise NestJS scaffold with DDD boundaries, JWT auth (roles/permissions), audit logging, Bull queues (Redis), circuit-breaker for outbound calls, standardized responses, and Prisma with soft-delete ("paranoid") semantics.

### Core Components

- **Prisma ORM** with soft delete support and paranoid filtering
- **JWT Authentication** with role/permission-based authorization
- **Bull Queue** system with Redis backend and web UI
- **Circuit Breaker** pattern for external API resilience
- **Audit Logging** for all user actions
- **Response Transformation** with standardized API format

## Module Structure Pattern

Each feature module follows this exact structure:

```
src/modules/[feature]/
├── [feature].module.ts
├── controllers/
│   ├── [feature].controller.ts
│   ├── filters/        # Prisma query filters (optional)
│   ├── requests/       # Input DTOs with validation
│   └── viewmodels/     # Output DTOs for serialization
├── services/
│   └── [feature].service.ts
└── interfaces/         # Domain contracts or enums (optional)
```

Note: Some modules may also include `strategy/` directories for domain-specific contracts and patterns.

## Code Style Patterns

### Import Order and Organization

Follow this consistent import order across all files:

```typescript
// 1. External libraries
import { Injectable } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Prisma, [Feature] } from '@prisma/client';

// 2. Local services (using alias)
import { [Feature]Service } from '@services/[feature].service';
import { PrismaService } from '@services/prisma.service';

// 3. DTOs and ViewModels (using alias)
import { [Feature]Vm } from '@viewmodels/[feature].viewmodel';
import { FilterSearch[Feature]], Create[Feature]Request, Update[Feature]Request } from '@requests/[feature].request';

// 4. Utils and decorators (using alias)
import { SerializeResponse } from '@utils/decorators/response/serialize-response.decorator';
import { AuthenticatedUser, AuthenticatedAdmin } from '@utils/decorators/authenticate-user.decorator';
import { Permission } from '@utils/decorators/permission.decorator';
import { PrismaFilter } from '@utils/decorators/base-filter.decorator';
import { UserAccess } from '@utils/decorators/user-access.decorator';

// 5. Relative imports (filters, interfaces)
import { [Feature]Filter } from '../controllers/filters/[feature].filter';
```

### Module File (`[feature].module.ts`)

```typescript
import { Module } from '@nestjs/common';
import { PrismaModule } from '@modules/prisma.module';
import { [Feature]Service } from './services/[feature].service';
import { [Feature]Controller } from './controllers/[feature].controller';

@Module({
  imports: [PrismaModule],
  providers: [[Feature]Service],
  controllers: [[Feature]Controller],
})
export class [Feature]Module {}
```

### Controller Pattern (`controllers/[feature].controller.ts`)

```typescript
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { [Feature]Service } from '@services/[feature].service';
import { [Feature]Vm } from '@viewmodels/[feature].viewmodel';
import { SerializeResponse } from '@utils/decorators/response/serialize-response.decorator';
import { UserAccess } from '@utils/decorators/user-access.decorator';
import { AuthenticatedAdmin, AuthenticatedUser } from '@utils/decorators/authenticate-user.decorator';
import { Permission } from '@utils/decorators/permission.decorator';
import { PrismaFilter } from '@utils/decorators/base-filter.decorator';
import { FilterSearch[Feature]], Create[Feature]Request, Update[Feature]Request } from '@requests/[feature].request';

@ApiTags('([Feature]) [Feature] Management')
@AuthenticatedUser()
@Controller('[feature]')
export class [Feature]Controller {
  constructor(private readonly service: [Feature]Service) {}

  @ApiOperation({ summary: 'Create a new [feature]' })
  @SerializeResponse({ vm: [Feature]Vm, hasMessage: true })
  @AuthenticatedAdmin()
  @Permission(['create_[features]'])
  @Post()
  async create(@Body() createRequest: Create[Feature]Request) {
    return this.service.create(createRequest);
  }

  @ApiOperation({ summary: 'Get all [features]' })
  @SerializeResponse({ vm: [Feature]Vm, type: 'pagination', hasMessage: true })
  @AuthenticatedAdmin()
  @Permission(['read_[features]'])
  @Get()
  async findAll(
    @PrismaFilter() filter: Prisma.[Feature]FindManyArgs,
    @Query() query: FilterSearch[Feature]],
  ) {
    return this.service.findAll(filter, query);
  }

  @ApiOperation({ summary: 'Get a [feature] by ID' })
  @SerializeResponse({ vm: [Feature]Vm })
  @AuthenticatedAdmin()
  @Permission(['read_[features]'])
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Update a [feature]' })
  @SerializeResponse({ vm: [Feature]Vm, hasMessage: true })
  @AuthenticatedAdmin()
  @Permission(['update_[features]'])
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRequest: Update[Feature]Request) {
    return this.service.update(id, updateRequest);
  }

  @ApiOperation({ summary: 'Delete a [feature]' })
  @SerializeResponse({ vm: [Feature]Vm, hasMessage: true })
  @AuthenticatedAdmin()
  @Permission(['delete_[features]'])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
```

### Service Pattern (`services/[feature].service.ts`)

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@services/prisma.service';
import { Prisma, [Feature] } from '@prisma/client';
import { FilterSearch[Feature]], Create[Feature]Request, Update[Feature]Request } from '@requests/[feature].request';
import { [Feature]Filter } from '../controllers/filters/[feature].filter';

@Injectable()
export class [Feature]Service {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    filter: Prisma.[Feature]FindManyArgs,
    query: FilterSearch[Feature]],
  ): Promise<{ message: string; rows: [Feature][]; count: number }> {
    const [feature]Filter = new [Feature]Filter(filter, query);

    const [rows, count] = await Promise.all([
      this.prisma.[feature].findMany([feature]Filter),
      this.prisma.[feature].count({ where: [feature]Filter.where }),
    ]);

    return { message: 'Get all [features]', rows, count };
  }

  async findOne(id: string): Promise<[Feature]> {
    return this.prisma.[feature].findUniqueOrThrow({
      where: { id },
    });
  }

  async create(data: Create[Feature]Request): Promise<[Feature]> {
    return this.prisma.[feature].create({
      data,
    });
  }

  async update(id: string, data: Update[Feature]Request): Promise<[Feature]> {
    return this.prisma.[feature].update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<[Feature]> {
    return this.prisma.[feature].delete({
      where: { id },
    });
  }
}
```

### Request DTOs Pattern (`controllers/requests/[feature].request.ts`)

```typescript
import { IsOptional, IsString, IsArray, IsUUID } from 'class-validator';

export class FilterSearch[Feature]] {
  @IsOptional()
  @IsString()
  name?: string;
}

export class Create[Feature]Request {
  @IsString()
  name: string;

  @IsString()
  displayName: string;
}

export class Update[Feature]Request {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  displayName?: string;
}
```

### ViewModel Pattern (`controllers/viewmodels/[feature].viewmodel.ts`)

```typescript
import { Expose, Transform } from 'class-transformer';

export class [Feature]Vm {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  displayName: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // Example of complex transformation for relations
  @Expose()
  @Transform(({ obj }) => {
    if (obj.relation && obj.relation.length) {
      return obj.relation.map((item: any) => ({
        id: item.id,
        name: item.name,
        displayName: item.displayName,
      }));
    }
    return [];
  })
  relation: Array<{
    id: string;
    name: string;
    displayName: string;
  }>;
}
```

### Filter Pattern (`controllers/filters/[feature].filter.ts`)

```typescript
import { Prisma } from '@prisma/client';
import { BaseFilter } from '@utils/base-class/base-filter';
import { FilterSearch[Feature]] } from '@requests/[feature].request';

export class [Feature]Filter extends BaseFilter<
  Prisma.[Feature]WhereInput,
  Prisma.[Feature]FindManyArgs
> {
  constructor(filter: Prisma.[Feature]FindManyArgs, query: FilterSearch[Feature]]) {
    super(filter);

    if (query.name) {
      this.searchFilter(query.name);
    }
  }

  searchFilter(search: string) {
    this.where = {
      ...this.where,
      OR: [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          displayName: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ],
    };

    return this;
  }
}
```

## Path Aliases (Critical for Imports)

Use these specific aliases defined in `tsconfig.json`:

- `@modules/*` - Module imports across the application
- `@services/*` - Service layer classes from all modules
- `@requests/*` - Request DTOs and filters from all modules
- `@viewmodels/*` - Response DTOs and view models from all modules
- `@utils/*` - Shared utilities and decorators

## Naming Conventions

### Files and Classes

- **Module files**: `[feature].module.ts` (kebab-case for files, PascalCase for classes)
- **Controller files**: `[feature].controller.ts` → `[Feature]Controller`
- **Service files**: `[feature].service.ts` → `[Feature]Service`
- **Request DTOs**: `[feature].request.ts` → `FilterSearch[Feature]]`, `Create[Feature]Request`, `Update[Feature]Request`
- **ViewModels**: `[feature].viewmodel.ts` → `[Feature]Vm`
- **Filters**: `[feature].filter.ts` → `[Feature]Filter`

### API Tags and Operations

- **Controller API Tags**: `([Feature]) [Feature] Management` for CRUD operations
- **Simple tags**: `[Feature]` for auth-like endpoints
- **Operation summaries**: Use consistent patterns like "Get all [features]", "Create a new [feature]"

### Permissions

- Follow the pattern: `[action]_[features]` (plural)
- Examples: `create_users`, `read_roles`, `update_permissions`, `delete_[features]`

## Authentication & Authorization

### Guards and Decorators Pattern

Use the actual decorators from your codebase:

```typescript
import { AuthenticatedUser, AuthenticatedAdmin } from '@utils/decorators/authenticate-user.decorator';
import { Permission } from '@utils/decorators/permission.decorator';
import { UserAccess } from '@utils/decorators/user-access.decorator';

@AuthenticatedUser()     // Requires JWT token (uses AuthGuard('auth'))
@AuthenticatedAdmin()    // Requires admin role (includes RoleGuard)
@Permission(['read_users']) // Requires specific permission
@UserAccess() user: User    // Injects current user if needed
```

Role hierarchy: User → Admin (permissions checked via `PermissionGuard`)

### Authorization Patterns by Endpoint Type

- **Public endpoints**: No decorators needed
- **User-only endpoints**: `@AuthenticatedUser()`
- **Admin endpoints**: `@AuthenticatedAdmin()`
- **Permission-based**: `@AuthenticatedAdmin()` + `@Permission(['action_resource'])`
- **User profile**: `@AuthenticatedUser()` + `@UserAccess() user: User`

## Response Pattern

All endpoints use `@SerializeResponse()` with two types:

```typescript
// Single resource
@SerializeResponse({ vm: UserVm })

// Paginated collection
@SerializeResponse({ vm: UserVm, type: 'pagination', hasMessage: true })

// Simple message response
@SerializeResponse({ vm: Object, hasMessage: true })
```

Use `hasMessage: true` for operations that return success messages

Output format: `{ status: true, message?: string, data: T, meta?: PaginationMeta }`

## Prisma Integration

### Extended Client Features

- **Soft Delete**: Automatic `deletedAt: null` filtering in relations
- **Paranoid Mode**: Use `ignoreParanoids` array to bypass soft delete filtering
- **Base Filter**: Extends `BaseFilter<WhereInput, FindManyArgs>` for query building

### Service Patterns for Database Operations

#### Simple Query (without filter class)

```typescript
// For basic filtering without complex search logic
const [rows, count] = await Promise.all([
  this.prisma.user.findMany({
    ...filter,
    where: {
      fullname: query.fullname,
      username: query.username,
      email: query.email,
    },
    include: {
      relation: true,
    },
    ...{ ignoreParanoids: ['relation'] }, // If needed
  }),
  this.prisma.user.count(),
]);
```

#### Complex Query (with filter class)

```typescript
// For complex search logic and reusable filters
const [feature]Filter = new [Feature]Filter(filter, query);

const [rows, count] = await Promise.all([
  this.prisma.[feature].findMany([feature]Filter),
  this.prisma.[feature].count({ where: [feature]Filter.where }),
]);
```

### CRUD Operation Patterns

#### Create with Relations

```typescript
return this.prisma.[feature].create({
  data: {
    name: data.name,
    displayName: data.displayName,
    ...(data.relationIds && {
      pivotRelation: {
        create: data.relationIds.map((relationId) => ({
          relationId,
        })),
      },
    }),
  },
  include: {
    pivotRelation: {
      include: {
        relation: true,
      },
    },
  },
});
```

#### Update with Relations

```typescript
return this.prisma.[feature].update({
  where: { id },
  data: {
    ...(data.name && { name: data.name }),
    ...(data.displayName && { displayName: data.displayName }),
    ...(data.relationIds && {
      pivotRelation: {
        deleteMany: {}, // Clear existing relations
        create: data.relationIds.map((relationId) => ({
          relationId,
        })),
      },
    }),
  },
  include: {
    pivotRelation: {
      include: {
        relation: true,
      },
    },
  },
});
```

### Filter Pattern

```typescript
// In controller
@PrismaFilter() filter: Prisma.UserFindManyArgs,
@Query() query: FilterSearch[Feature]

// In service using filter class (see role/permission example)
const [feature]Filter = new [Feature]Filter(filter, query);
return this.prisma.[feature].findMany([feature]Filter);
```

## Real-World Examples

### Auth Module Pattern (Reference: `auth.controller.ts`)

```typescript
// Simple auth endpoints without CRUD operations
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @SerializeResponse({ vm: AuthLoginVm })
  @Post('login')
  async login(@Body() body: AuthLoginRequest) {
    return await this.service.login(body);
  }

  @ApiOperation({ summary: 'Logout from All Devices' })
  @AuthenticatedUser()
  @SerializeResponse({ vm: Object, hasMessage: true })
  @Post('logout-all')
  async logoutAll(@UserAccess() user: User) {
    await this.service.logoutAll(user.id);
    return { message: 'Successfully logged out from all devices' };
  }
}
```

### User Profile Pattern (Reference: `user.controller.ts`)

```typescript
// Mixed endpoints: admin CRUD + user profile
@Get('profile')
@SerializeResponse({ vm: UserVm })
async profile(@UserAccess() user: User) {
  return user; // Direct user object return
}
```

### Complex Relations (Reference: `role.service.ts`)

```typescript
// Complex include patterns for relations
return this.prisma.role.findUniqueOrThrow({
  where: { id },
  include: {
    permissions: true,
    pivotRolePermission: {
      include: {
        permission: true,
      },
    },
  },
});
```

## Best Practices and Gotchas

### Service Return Patterns

#### Paginated Data (findAll methods)

```typescript
return { message: 'Get all [features]', rows, count };
```

#### Single Resource (findOne, create, update, remove)

```typescript
return this.prisma.[feature].findUniqueOrThrow({ where: { id } });
```

#### Manual Message Response

```typescript
return { message: 'Custom success message' };
```

### Validation Patterns

#### Required Fields

```typescript
@IsString()
name: string;
```

#### Optional Fields

```typescript
@IsOptional()
@IsString()
name?: string;
```

#### Array Relations

```typescript
@IsOptional()
@IsArray()
@IsUUID('4', { each: true })
relationIds?: string[];
```

### ViewModel Transformation Best Practices

#### Simple Field Exposure

```typescript
@Expose()
name: string;
```

#### Complex Relation Mapping (Reference: `role.viewmodel.ts`)

```typescript
@Expose()
@Transform(({ obj }) => {
  if (obj.pivotRolePermission && obj.pivotRolePermission.length) {
    return obj.pivotRolePermission.map((rolePermission: any) => ({
      id: rolePermission.permission?.id,
      name: rolePermission.permission?.name,
      displayName: rolePermission.permission?.displayName,
    }));
  }
  return [];
})
permissions: Array<{
  id: string;
  name: string;
  displayName: string;
}>;
```

### Module Registration in `app.module.ts`

Don't forget to register new modules:

```typescript
imports: [
  // ... existing modules
  [Feature]Module,
],
```

### Constructor Injection Pattern

Always use `private readonly` for service injection:

```typescript
constructor(private readonly service: [Feature]Service) {}
constructor(private readonly prisma: PrismaService) {}
```

## Queue System

Uses Bull with Redis. Queues have dashboard at `/queues/ui`.

- Configure in `QueueModule`
- Access via `@InjectQueue('queue-name')`
- Monitor with Bull Board web UI

### Queue Module Structure Pattern

Each queue module follows this exact structure:

```
src/modules/queues/[feature]/
├── [feature].module.ts         # Module registration with BullModule and BullBoard
├── [feature].const.ts          # Queue and job name constants
├── processors/                 # Queue processors with @Processor decorator
│   ├── [job1].processor.ts     # Individual job processors
│   └── [job2].processor.ts
├── services/                   # Queue service classes for job management
│   ├── [job1].service.ts       # Service to enqueue and manage jobs
│   └── [job2].service.ts
└── interfaces/                 # Job data contracts and enums
    ├── [feature].interface.ts  # Shared enums (JobStatusEnum)
    └── [job].interface.ts      # Job-specific interfaces
```

### Queue Module Pattern (`queues/[feature]/[feature].module.ts`)

```typescript
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { PrismaModule } from '@modules/prisma.module';
import { JobNameProcessor } from './processors/job-name.processor';
import { SecondJobProcessor } from './processors/second-job.processor';
import { JobNameQueueService } from './services/job-name.service';
import { SecondJobQueueService } from './services/second-job.service';

import { jobNameQueue, secondJobQueue } from './feature-name.const';

@Module({
  imports: [
    BullModule.registerQueue({ name: jobNameQueue }),
    BullModule.registerQueue({ name: secondJobQueue }),
    BullBoardModule.forFeature({
      name: jobNameQueue,
      adapter: BullAdapter,
    }),
    BullBoardModule.forFeature({
      name: secondJobQueue,
      adapter: BullAdapter,
    }),
    PrismaModule,
    // Other dependencies
  ],
  providers: [
    JobNameProcessor,
    SecondJobProcessor,
    JobNameQueueService,
    SecondJobQueueService,
  ],
  exports: [JobNameQueueService, SecondJobQueueService],
})
export class FeatureQueueModule {}
```

### Queue Constants Pattern (`queues/[feature]/[feature].const.ts`)

```typescript
export const jobNameJob = 'job-name-job';
export const jobNameQueue = 'job-name-queue';

export const secondJobJob = 'second-job-job';
export const secondJobQueue = 'second-job-queue';
```

### Queue Processor Pattern (`queues/[feature]/processors/[job].processor.ts`)

```typescript
import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '@services/prisma.service';
import { jobNameJob, jobNameQueue } from '../feature-name.const';
import { JobStatusEnum } from '../interfaces/feature-name.interface';
import type { IJobNameJob } from '../interfaces/job-name.interface';

@Processor({ name: jobNameQueue })
export class JobNameProcessor {
  constructor(private readonly prisma: PrismaService) {}

  @Process({ name: jobNameJob })
  async handleJobName(job: Job<{ jobId: string }>): Promise<void> {
    const { jobId } = job.data;

    try {
      Logger.log(
        `[${JobNameProcessor.name}] Running queue with job id: ${jobId}`,
      );

      const jobData = await this.prisma.dmJob.findFirst({
        where: { jobId },
      });

      const jobPayload = jobData.jobPayload as IJobNameJob;

      // Job processing logic here

      await this.prisma.dmJob.update({
        where: { jobId },
        data: {
          jobStatus: JobStatusEnum.COMPLETED_JOB_NAME,
        },
      });

      Logger.log(
        `[${JobNameProcessor.name}] Successfully completed job id: ${jobId}`,
      );
    } catch (error) {
      Logger.error(
        `[${JobNameProcessor.name}] Failed to process job id: ${jobId}`,
        error,
      );

      await this.createJobExceptions(
        jobId,
        error.message,
        JobStatusEnum.FAILED_JOB_NAME,
      );
    }
  }

  private async createJobExceptions(
    jobId: string,
    exception: string,
    jobStatus: JobStatusEnum,
  ): Promise<void> {
    await this.prisma.dmJob.update({
      where: { jobId },
      data: {
        jobStatus,
        jobExceptions: exception,
      },
    });
  }
}
```

### Queue Service Pattern (`queues/[feature]/services/[job].service.ts`)

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { PrismaService } from '@services/prisma.service';
import { jobNameJob, jobNameQueue } from '../feature-name.const';
import { JobStatusEnum } from '../interfaces/feature-name.interface';
import type { IJobNameJob } from '../interfaces/job-name.interface';

const { NUMBER_OF_RUN_QUEUE } = process.env;

@Injectable()
export class JobNameQueueService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(jobNameQueue)
    private readonly jobNameQueue: Queue,
  ) {}

  async proceedJobName(): Promise<void> {
    // Using FIFO = First In First Out by createdAt
    const jobList = await this.prisma.dmJob.findMany({
      where: {
        jobStatus: JobStatusEnum.PENDING_JOB_NAME,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: Number(NUMBER_OF_RUN_QUEUE),
    });

    for (const job of jobList) {
      await this.jobNameQueue.add(
        jobNameJob,
        { jobId: job.jobId },
        {
          removeOnComplete: false,
          removeOnFail: false,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
        },
      );
    }
  }

  async addJobName(data: IJobNameJob): Promise<void> {
    const jobId = crypto.randomUUID();

    await this.prisma.dmJob.create({
      data: {
        jobId,
        jobStatus: JobStatusEnum.PENDING_JOB_NAME,
        jobPayload: data,
      },
    });

    await this.jobNameQueue.add(
      jobNameJob,
      { jobId },
      {
        removeOnComplete: false,
        removeOnFail: false,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    );
  }
}
```

### Queue Interfaces Pattern (`queues/[feature]/interfaces/[feature].interface.ts`)

```typescript
export enum JobStatusEnum {
  PENDING_JOB_NAME = 'pending-job-name',
  COMPLETED_JOB_NAME = 'completed-job-name',
  FAILED_JOB_NAME = 'failed-job-name',
  REORDERED_JOB_NAME = 'reordered-job-name',
}
```

### Job Interface Pattern (`queues/[feature]/interfaces/[job].interface.ts`)

```typescript
export interface IJobNameJob {
  userId: string;
  parameter: number;
  optionalFlag?: boolean;
}
```

### Cron Job Integration Pattern

For scheduled queue processing, integrate with controllers using `@Cron`:

```typescript
import { Cron } from '@nestjs/schedule';
import { JobNameQueueService } from '@services/job-name.service';

@Controller('feature')
export class FeatureController {
  constructor(private readonly jobNameQueueService: JobNameQueueService) {}

  @Cron('* * * * *') // Every minute
  async handleJobNameQueue() {
    await this.jobNameQueueService.proceedJobName();
  }
}
```

### Queue Usage in Services

```typescript
import { JobQueueService } from '@services/job-queue.service';

@Injectable()
export class FeatureService {
  constructor(private readonly jobQueue: JobQueueService) {}

  async triggerJob(data: IJobData): Promise<void> {
    await this.jobQueue.addJob(data);
  }
}
```

### Real-World Example: Force Delete Expired Users Queue

Based on domain queue patterns, here's how to create a force delete user queue:

```typescript
// queues/user-cleanup/user-cleanup.const.ts
export const forceDeleteUserJob = 'force-delete-user-job';
export const forceDeleteUserQueue = 'force-delete-user-queue';

// queues/user-cleanup/interfaces/user-cleanup.interface.ts
export enum JobStatusEnum {
  PENDING_FORCE_DELETE_USER = 'pending-force-delete-user',
  COMPLETED_FORCE_DELETE_USER = 'completed-force-delete-user',
  FAILED_FORCE_DELETE_USER = 'failed-force-delete-user',
}

export interface IForceDeleteUserJob {
  userId: string;
  deletedAt: Date;
}

// queues/user-cleanup/processors/force-delete-user.processor.ts
@Processor({ name: forceDeleteUserQueue })
export class ForceDeleteUserProcessor {
  constructor(private readonly prisma: PrismaService) {}

  @Process({ name: forceDeleteUserJob })
  async handleForceDeleteUser(job: Job<{ jobId: string }>): Promise<void> {
    const { jobId } = job.data;
    const jobPayload = jobData.jobPayload as IForceDeleteUserJob;

    // Force delete user and related data
    await this.prisma.user.delete({
      where: { id: jobPayload.userId },
    });
  }
}

// queues/user-cleanup/services/force-delete-user.service.ts
@Injectable()
export class ForceDeleteUserQueueService {
  async proceedForceDeleteUser(): Promise<void> {
    const expiredUsers = await this.prisma.user.findMany({
      where: {
        deletedAt: {
          lte: dayjs().subtract(30, 'days').toDate(),
          not: null,
        },
      },
    });

    for (const user of expiredUsers) {
      await this.addForceDeleteUser({
        userId: user.id,
        deletedAt: user.deletedAt,
      });
    }
  }
}
```

### Queue Naming Conventions

- **Queue names**: `[action]-[resource]-queue` (kebab-case)
- **Job names**: `[action]-[resource]-job` (kebab-case)
- **Processor classes**: `[Action][Resource]Processor` (PascalCase)
- **Service classes**: `[Action][Resource]QueueService` (PascalCase)
- **Interface names**: `I[Action][Resource]Job` (PascalCase)
- **Enum values**: `[STATUS]_[ACTION]_[RESOURCE]` (UPPER_SNAKE_CASE)

## Circuit Breaker

For external API calls, use `SafeRequestService` from the circuit-breaker module:

```typescript
constructor(private readonly safeRequest: SafeRequestService) {}

async callExternalAPI() {
  return this.safeRequest.get('https://external-api.com/endpoint', {
    cbOptions: { timeout: 5000 }
  });
}
```

**Available Methods:** `get`, `post`, `put`, `patch`, `delete`

## Development Commands

```bash
# Database
npm run prisma:migrate-deploy  # Apply migrations
npm run prisma:generate-client # Generate Prisma client
npm run prisma:seed            # Seed database

# Development
npm run start:dev            # Watch mode
npm run start:debug          # Debug mode

# Testing
npm run test:e2e            # End-to-end tests

# Code Quality
npm run lint                # ESLint check and fix
npm run format              # Prettier formatting
```

## Code Generation

Use `templates/request.filter.mustache` for generating request filters. Replace:

- `FILTER_NAME` - Filter class name
- `MODELNAME` - Prisma model name
- `QUERY_REQUEST` - Query DTO interface

## Key Files to Reference

- `src/modules/prisma/services/prisma.service.ts` - Extended Prisma client
- `src/utils/decorators/` - All custom decorators
- `src/utils/interceptors/response/` - Response transformation
- `src/modules/auth/strategy/` - Auth guards and strategies
