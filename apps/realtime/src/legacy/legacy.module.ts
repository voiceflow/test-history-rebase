import { Module } from '@nestjs/common';

import { AssistantModule } from '@/assistant/assistant.module';
import { ProjectListModule } from '@/project-list/project-list.module';

import { IOServer } from './ioServer';
import { LegacyService } from './legacy.service';

@Module({
  imports: [ProjectListModule, AssistantModule],
  providers: [LegacyService, IOServer],
})
export class LegacyModule {}
