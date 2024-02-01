import { Module } from '@nestjs/common';

import { BillingInvoiceHTTPController } from './invoice.http.controller';
import { BillingInvoiceService } from './invoice.service';

@Module({
  providers: [BillingInvoiceService],
  controllers: [BillingInvoiceHTTPController],
})
export class BillingInvoiceModule {}
