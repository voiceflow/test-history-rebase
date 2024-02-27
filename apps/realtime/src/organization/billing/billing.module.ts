import { Module } from '@nestjs/common';

import { BillingInvoiceModule } from './invoice/invoice.module';
import { BillingSubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [BillingSubscriptionModule, BillingInvoiceModule],
})
export class OrganizationBillingModule {}
