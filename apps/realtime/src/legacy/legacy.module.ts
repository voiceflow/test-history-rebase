import { Module } from '@nestjs/common';

import { AssistantModule } from '@/assistant/assistant.module';
import { ProjectListModule } from '@/project-list/project-list.module';
import { ThreadModule } from '@/thread/thread.module';

import { IOServer } from './ioServer';
import { LegacyService } from './legacy.service';

@Module({
  imports: [ProjectListModule, AssistantModule, ThreadModule],
  providers: [LegacyService, IOServer],
  exports: [LegacyService],
})
export class LegacyModule {}
