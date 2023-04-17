export interface InvoiceLineItem {
  id: string;
  amount: number;
  quantity: number;
}

export interface SubscriptionBillingPeriod {
  invoiceID?: string;
  billingStartDate: Date;
  billingEndDate: Date;
  amountDue?: number;
  items: InvoiceLineItem[];
}
