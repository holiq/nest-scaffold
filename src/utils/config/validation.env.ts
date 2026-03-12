import { plainToInstance, Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidationError,
  validateSync,
} from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  DATABASE_URL: string;

  @IsString()
  @MinLength(32)
  JWT_SECRET_KEY: string;

  @Type(() => Number)
  @IsNumber()
  JWT_EXPIRES_IN: number;

  @Type(() => Number)
  @IsNumber()
  JWT_REFRESH_EXPIRES_IN: number;

  @IsString()
  REDIS_HOST: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  REDIS_PORT: number = 6379;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  APP_PORT: number = 3000;
}

const formatErrors = (errors: ValidationError[]): string => {
  return errors
    .map((error) => {
      if (error.constraints) {
        return Object.values(error.constraints).join(', ');
      }

      return `Invalid environment variable: ${error.property}`;
    })
    .join('; ');
};

export const validateEnvironment = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`Environment validation failed: ${formatErrors(errors)}`);
  }

  return validatedConfig;
};
