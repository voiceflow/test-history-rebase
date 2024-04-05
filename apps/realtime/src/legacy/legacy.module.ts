import { Module } from '@nestjs/common';

import { AssistantModule } from '@/assistant/assistant.module';
import { FlowModule } from '@/flow/flow.module';
import { OrganizationModule } from '@/organization/organization.module';
import { ProjectModule } from '@/project/project.module';
import { ProjectListModule } from '@/project-list/project-list.module';
import { ThreadModule } from '@/thread/thread.module';
import { WorkflowModule } from '@/workflow/workflow.module';

import { IOServer } from './ioServer';
import { LegacyService } from './legacy.service';

@Module({
  imports: [ProjectListModule, AssistantModule, ThreadModule, ProjectModule, OrganizationModule, FlowModule, WorkflowModule],
  providers: [LegacyService, IOServer],
  exports: [LegacyService],
})
export class LegacyModule {}
