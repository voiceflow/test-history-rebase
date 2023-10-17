import { Module } from '@nestjs/common';

import { DiagramModule } from '@/diagram/diagram.module';
import { LegacyModule } from '@/legacy/legacy.module';
import { ProjectORM } from '@/orm/project.orm';
import { VersionORM } from '@/orm/version.orm';
import { ProgramModule } from '@/program/program.module';
import { PrototypeProgramModule } from '@/prototype-program/prototype-program.module';
import { VariableStateModule } from '@/variable-state/variable-state.module';

import { VersionHTTPController } from './version.http.controller';
import { VersionService } from './version.service';

@Module({
  imports: [LegacyModule, DiagramModule, VariableStateModule, ProgramModule, PrototypeProgramModule],
  providers: [VersionORM, VersionService, ProjectORM],
  controllers: [VersionHTTPController],
  exports: [VersionService],
})
export class VersionModule {}
