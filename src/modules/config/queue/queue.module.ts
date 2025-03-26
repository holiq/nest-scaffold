import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullConfigProvider } from './queue.provider';

@Module({
  imports: [
    BullModule.forRootAsync({
      useClass: BullConfigProvider,
    }),
    BullBoardModule.forRoot({
      route: '/queues/ui',
      adapter: ExpressAdapter,
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
