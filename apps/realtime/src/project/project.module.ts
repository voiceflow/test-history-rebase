import { Module } from '@nestjs/common';
import { VersionIntentORM, VersionSlotORM } from '@voiceflow/orm-designer';

import { DiagramModule } from '@/diagram/diagram.module';
import { LegacyModule } from '@/legacy/legacy.module';
import { VersionModule } from '@/version/version.module';

import { ProjectLoguxController } from './project.controller.logux';
import { ProjectService } from './project.service';

@Module({
  imports: [VersionSlotORM.register(), VersionIntentORM.register(), VersionModule, DiagramModule, LegacyModule],
  exports: [ProjectService],
  providers: [ProjectService],
  controllers: [ProjectLoguxController],
})
export class ProjectModule {}
