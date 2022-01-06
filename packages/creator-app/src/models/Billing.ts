import { PlanType } from '@voiceflow/internal';

export interface Billing {
  invoices: Billing.PastInvoice[] | null;
  upcoming: Billing.Invoice | null;
}

export namespace Billing {
  export interface Invoice {
    items: string[];
    amount: number;
    date: string;
  }

  export type PastInvoice = Invoice & {
    status: unknown;
  };
}

export interface DBPayment {
  plan: PlanType;
  seats: number;
  period: string;
  source: DBPaymentSource | null;
  projects: number;
  // NOTE(trs): Not returned by creator-api
  id?: PlanType;
  pricing?: unknown;
  legacy?: boolean;
  hidden?: boolean;
}

export interface DBPaymentSource {
  type: 'card';
  brand: string;
  last4: string;
}

export interface DBBilling {
  invoices?: DBBilling.PastInvoice[];
  upcoming?: DBBilling.Invoice;
}

export namespace DBBilling {
  export interface Invoice {
    items: string[];
    amount: number;
    timestamp: number;
  }

  export type PastInvoice = Invoice & {
    status: unknown;
  };
}
