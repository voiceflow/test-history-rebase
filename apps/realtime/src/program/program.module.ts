import { Module } from '@nestjs/common';

import { LegacyModule } from '@/legacy/legacy.module';
import { ProgramORM } from '@/orm/program.orm';

import { ProgramService } from './program.service';

@Module({
  imports: [LegacyModule],
  providers: [ProgramORM, ProgramService],
  exports: [ProgramService],
})
export class ProgramModule {}
