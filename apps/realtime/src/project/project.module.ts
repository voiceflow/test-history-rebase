import { Module } from '@nestjs/common';

import { DiagramModule } from '@/diagram/diagram.module';
import { VersionModule } from '@/version/version.module';

import { ProjectService } from './project.service';

@Module({
  imports: [VersionModule, DiagramModule],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
