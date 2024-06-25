import { createSimpleAdapter, notImplementedAdapter } from 'bidirectional-adapter';
import dayjs from 'dayjs';

import type { Billing, DBBilling } from '@/models';

const timestampToDate = (timestamp: number) => dayjs.unix(timestamp).format('DD MMM YY');

const convertAmountToDollars = (amount: number) => amount / 100;

const invoiceListAdapter = createSimpleAdapter<DBBilling.InvoiceList, Billing.InvoiceList>(
  ({ data, hasMore }) => ({
    data: data.map(({ id, status, amount, timestamp, items, pdf }) => ({
      id,
      status,
      pdf,
      amount: convertAmountToDollars(amount),
      date: timestampToDate(timestamp),
      items,
    })),
    hasMore,
  }),
  notImplementedAdapter.transformer
);

export default invoiceListAdapter;
