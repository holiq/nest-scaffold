import { Module } from '@nestjs/common';
import { PrismaService } from '@services/prisma.service';
import { ExistsInTableConstraint } from '@utils/validation/exists-in-table';

@Module({
  providers: [PrismaService, ExistsInTableConstraint],
  exports: [PrismaService],
})
export class PrismaModule {}
