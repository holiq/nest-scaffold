import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueueModule } from '@modules/queue.module';
import { AuthModule } from '@modules/auth.module';
import { AuditLogModule } from '@modules/audit-log.module';
import { UserModule } from '@modules/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    QueueModule,
    AuthModule,
    AuditLogModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
