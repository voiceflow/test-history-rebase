import { Module } from '@nestjs/common';

import { BillingHTTPController } from './billing.http.controller';
import { BillingService } from './billing.service';
import { BillingInvoiceModule } from './invoice/invoice.module';
import { BillingSubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [BillingSubscriptionModule, BillingInvoiceModule],
  controllers: [BillingHTTPController],
  providers: [BillingService],
})
export class OrganizationBillingModule {}
