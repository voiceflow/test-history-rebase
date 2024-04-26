import type { BillingPeriod, PlanType } from '@voiceflow/internal';

export interface Billing {
  invoices: Billing.PastInvoice[] | null;
  upcoming: Billing.Invoice | null;
}

export namespace Billing {
  export interface Invoice {
    items: string[];
    amount: number;
    date: string;
    pdf?: string;
  }

  export type PastInvoice = Invoice & {
    id: string;
    status: unknown;
  };

  export interface InvoiceList {
    data: PastInvoice[];
    hasMore: boolean;
  }
}

export interface DBPlan {
  id: PlanType;
  period: string;
  source: DBPaymentSource | null;
  legacy?: boolean;
  hidden?: boolean;
  pricing: Record<BillingPeriod, { price: number }> | null;
  projects: number;
  editorLimit: number;
  viewerLimit: number;
  stripeProductID: string;
  interactionsLimit: number | null;
  variableStatesLimit: number | null;
}

export interface DBPayment {
  plan: PlanType;
  seats: number;
  period: string;
  source: DBPaymentSource | null;
  projects: number;
}

export interface DBPaymentSource {
  type: 'card';
  brand: string;
  last4: string;
  expiration?: string;
}

export interface DBBilling {
  invoices?: DBBilling.PastInvoice[];
  upcoming?: DBBilling.Invoice;
}

export namespace DBBilling {
  export interface Invoice {
    id: string;
    items: string[];
    amount: number;
    timestamp: number;
    pdf?: string;
  }

  export type PastInvoice = Invoice & {
    status: unknown;
  };
  export interface InvoiceList {
    data: PastInvoice[];
    hasMore: boolean;
  }
}

export interface DBPlanSubscription {
  quantity: number;
  unitPrice: number;
  interval: BillingPeriod;
  nextBillingDate: number;
  cancelAtPeriodEnd: boolean;
}

export interface PlanSubscription {
  quantity: number;
  unitPrice: number;
  billingPeriod: BillingPeriod;
  nextBillingDate: string;
  cancelAtPeriodEnd: boolean;
}

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

export enum ChargebeeSubscriptionStatus {
  FUTURE = 'future',
  INTRIAL = 'in_trial',
  ACTIVE = 'active',
  NON_RENEWING = 'non_renewing',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
  TRANSFERRED = 'transferred',
}

export enum ChargebeeBillingPeriod {
  MONTH = 'month',
  YEAR = 'year',
}
