import { Module } from '@nestjs/common';

import { DiagramModule } from '@/diagram/diagram.module';
import { LegacyModule } from '@/legacy/legacy.module';
import { ProjectORM } from '@/orm/project.orm';
import { VersionORM } from '@/orm/version.orm';
import { VersionModule } from '@/version/version.module';

import { ProjectLoguxController } from './project.controller.logux';
import { ProjectService } from './project.service';

@Module({
  imports: [VersionModule, DiagramModule, LegacyModule],
  providers: [ProjectService, ProjectORM, VersionORM],
  exports: [ProjectService],
  controllers: [ProjectLoguxController],
})
export class ProjectModule {}
