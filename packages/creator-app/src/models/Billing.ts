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

export interface DBPaymentSource {
  brand?: string;
  last4?: string;
  plan?: PlanType;
  period?: string;
  seats?: number;
  source?: unknown;
  id: PlanType;
  pricing?: unknown;
  legacy?: boolean;
  hidden?: boolean;
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
