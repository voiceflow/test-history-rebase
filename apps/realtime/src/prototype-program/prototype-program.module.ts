import { Module } from '@nestjs/common';

import { LegacyModule } from '@/legacy/legacy.module';
import { PrototypeProgramORM } from '@/orm/prototype-program.orm';

import { PrototypeProgramService } from './prototype-program.service';

@Module({
  imports: [LegacyModule],
  providers: [PrototypeProgramORM, PrototypeProgramService],
  exports: [PrototypeProgramService],
})
export class PrototypeProgramModule {}
