import { forwardRef, Module } from '@nestjs/common';
import { AssistantORM, ProjectORM } from '@voiceflow/orm-designer';

import { LegacyModule } from '@/legacy/legacy.module';
import { OrganizationModule } from '@/organization/organization.module';
import { ProjectModule } from '@/project/project.module';
import { ProjectListModule } from '@/project-list/project-list.module';

import { WorkspaceBillingModule } from './billing/billing.module';
import { WorkspaceService } from './workspace.service';

@Module({
  imports: [
    forwardRef(() => WorkspaceBillingModule),
    LegacyModule,
    ProjectModule,
    ProjectListModule,
    OrganizationModule,
  ],
  providers: [AssistantORM, ProjectORM, WorkspaceService],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
