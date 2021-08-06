export interface Billing {
  invoices: Billing.PastInvoice[] | null;
  upcoming: Billing.Invoice | null;
}

export namespace Billing {
  export interface Invoice {
    items: unknown[];
    amount: number;
    date: string;
  }

  export type PastInvoice = Invoice & {
    status: unknown;
  };
}

export interface DBBilling {
  invoices?: DBBilling.PastInvoice[];
  upcoming?: DBBilling.Invoice;
}

export namespace DBBilling {
  export interface Invoice {
    items: unknown[];
    amount: number;
    timestamp: number;
  }

  export type PastInvoice = Invoice & {
    status: unknown;
  };
}
