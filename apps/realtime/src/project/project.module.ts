import { Module } from '@nestjs/common';

import { LegacyModule } from '@/legacy/legacy.module';

import { ProjectLoguxController } from './project.controller.logux';
import { ProjectService } from './project.service';

@Module({
  imports: [LegacyModule],
  providers: [ProjectService],
  controllers: [ProjectLoguxController],
})
export class ProjectModule {}
