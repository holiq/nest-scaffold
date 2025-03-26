import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { PrismaService } from '@services/prisma.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ExistsInTableConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [model, field] = args.constraints as [string, string];
    const modelName = model.charAt(0).toLowerCase() + model.slice(1);

    const row = await this.prisma[modelName].findFirst({
      where: {
        [field]: value,
      },
    });

    return !!row;
  }

  defaultMessage(args: ValidationArguments): string {
    const [model, field] = args.constraints as [string, string];
    const modelName = model.charAt(0).toLowerCase() + model.slice(1);

    return `record does not exist in ${modelName}`;
  }
}

export function ExistsInTable(
  model: string, // Table name
  field: string = 'id', // Field name, default is id
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [model, field],
      validator: ExistsInTableConstraint,
    });
  };
}
