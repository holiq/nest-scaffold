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

@Module({
  imports: [
    ConfigModule.forRoot(),
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
