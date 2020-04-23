export type Billing = {
  invoices: Billing.PastInvoice[] | null;
  upcoming: Billing.Invoice | null;
};

export namespace Billing {
  export type Invoice = {
    items: unknown[];
    amount: number;
    date: string;
  };

  export type PastInvoice = Invoice & {
    status: unknown;
  };
}

export type DBBilling = {
  invoices?: DBBilling.PastInvoice[];
  upcoming?: DBBilling.Invoice;
};

export namespace DBBilling {
  export type Invoice = {
    items: unknown[];
    amount: number;
    timestamp: number;
  };

  export type PastInvoice = Invoice & {
    status: unknown;
  };
}
