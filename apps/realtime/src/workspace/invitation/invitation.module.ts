import { forwardRef, Module } from '@nestjs/common';

import { OrganizationModule } from '@/organization/organization.module';

import { WorkspaceModule } from '../workspace.module';
import { WorkspaceInvitationLoguxController } from './invitation.logux.controller';
import { WorkspaceInvitationService } from './invitation.service';

@Module({
  imports: [forwardRef(() => WorkspaceModule), OrganizationModule],
  providers: [WorkspaceInvitationService],
  exports: [WorkspaceInvitationService],
  controllers: [WorkspaceInvitationLoguxController],
})
export class WorkspaceInvitationModule {}
