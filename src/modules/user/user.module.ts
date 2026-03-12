import { Module } from '@nestjs/common';
import { PrismaModule } from '@modules/prisma.module';
import { UserController } from './controllers/user.controller';
import { UserService } from '@services/user.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
