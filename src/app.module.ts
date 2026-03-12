import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueueModule } from '@modules/queue.module';
import { AuthModule } from '@modules/auth.module';
import { AuditLogModule } from '@modules/audit-log.module';
import { UserModule } from '@modules/user.module';
import { RoleModule } from '@modules/role.module';
import { PermissionModule } from '@modules/permission.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { validateEnvironment } from '@utils/config/validation.env';

@Module({
  imports: [
    ConfigModule.forRoot({ validate: validateEnvironment }),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60000, limit: 10 }] }),
    QueueModule,
    AuthModule,
    AuditLogModule,
    UserModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
