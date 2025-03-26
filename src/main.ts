import 'newrelic';

import { NestFactory } from '@nestjs/core';
import {
  Logger,
  NestApplicationOptions,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import {
  utilities as nestWinstonModuleUtil,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { AuditLogService } from '@services/audit-log.service';
import { HttpExceptionFilter } from '@utils/exceptions/http-exception.filter';

import { AppModule } from './app.module';

async function bootstrap() {
  let appOptions: NestApplicationOptions = {};

  if (process.env.NEW_RELIC_ENABLED === 'true') {
    appOptions = {
      ...appOptions,
      logger: WinstonModule.createLogger({
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              winston.format.json(),
              nestWinstonModuleUtil.format.nestLike(
                process.env.NEW_RELIC_APP_NAME,
                {
                  prettyPrint: true,
                  colors: true,
                },
              ),
            ),
          }),
        ],
      }),
    };
  }

  const app = await NestFactory.create(AppModule, appOptions);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalFilters(new HttpExceptionFilter(app.get(AuditLogService)));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('NEST SCAFFOLD API')
    .setDescription('API for Nest API')
    .setVersion('1.0')
    .addBearerAuth({
      description: 'Please enter token in following format: Bearer <JWT>',
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const host = process.env.APP_HOST ?? '127.0.0.1';
  const port = process.env.APP_PORT ?? 3000;

  await app.listen(port);
  Logger.log(`[NestApplication] Application started at http://${host}:${port}`);
}
bootstrap();
