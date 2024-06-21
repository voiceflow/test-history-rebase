import { forwardRef, Module } from '@nestjs/common';

import { LegacyModule } from '@/legacy/legacy.module';
import { OrganizationModule } from '@/organization/organization.module';

import { WorkspaceModule } from '../workspace.module';
import { WorkspaceBillingLoguxController } from './billing.logux.controller';
import { WorkspaceBillingService } from './billing.service';

@Module({
  imports: [forwardRef(() => WorkspaceModule), OrganizationModule, LegacyModule],
  providers: [WorkspaceBillingService],
  exports: [WorkspaceBillingService],
  controllers: [WorkspaceBillingLoguxController],
})
export class WorkspaceBillingModule {}
