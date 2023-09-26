import { Module } from '@nestjs/common';

import { DiagramModule } from '@/diagram/diagram.module';
import { LegacyModule } from '@/legacy/legacy.module';
import { ProjectModule } from '@/project/project.module';

import { VersionORM } from './version.orm';
import { VersionService } from './version.service';

@Module({
  imports: [LegacyModule, ProjectModule, DiagramModule],
  providers: [VersionORM, VersionService],
  exports: [VersionService],
})
export class VersionModule {}
