import { Module } from '@nestjs/common';

import { BillingInvoiceModule } from './invoice/invoice.module';
import { BillingPlanModule } from './plan/plan.module';
import { BillingSubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [BillingSubscriptionModule, BillingInvoiceModule, BillingPlanModule],
})
export class OrganizationBillingModule {}
