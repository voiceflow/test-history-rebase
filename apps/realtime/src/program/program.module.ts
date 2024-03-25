import { Module } from '@nestjs/common';
import { ProgramORM } from '@voiceflow/orm-designer';

import { ProgramService } from './program.service';

@Module({
  exports: [ProgramService],
  providers: [ProgramORM, ProgramService],
  controllers: [],
})
export class ProgramModule {}
