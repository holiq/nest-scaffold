import { Injectable } from '@nestjs/common';
import { QueueOptions } from 'bull';
import { SharedBullConfigurationFactory } from '@nestjs/bull';

@Injectable()
export class BullConfigProvider implements SharedBullConfigurationFactory {
  createSharedConfiguration(): QueueOptions {
    return {
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        family: 0,
      },
      prefix: process.env.REDIS_PREFIX,
    };
  }
}
