import { Inject, Injectable } from '@nestjs/common';
import { BillingClient } from '@voiceflow/sdk-billing';

@Injectable()
export class BillingInvoiceService {
  constructor(
    @Inject(BillingClient)
    private readonly billingClient: BillingClient
  ) {}

  async getInvoicePDF(invoiceID: string) {
    return this.billingClient.private.getSubscriptionInvoicePDF(invoiceID);
  }
}
