import { createSimpleAdapter, notImplementedAdapter } from 'bidirectional-adapter';
import dayjs from 'dayjs';

import { Billing, DBBilling } from '@/models';

const timestampToDate = (timestamp: number) => dayjs.unix(timestamp).format('MMMM Do YYYY');

const convertAmountToDollars = (amount: number) => amount / 100;

const invoiceAdapter = createSimpleAdapter<DBBilling, Billing>(
  ({ invoices, upcoming }) => ({
    invoices:
      invoices?.map(({ status, amount, timestamp, items }) => ({
        status,
        amount: convertAmountToDollars(amount),
        date: timestampToDate(timestamp),
        items,
      })) || null,
    upcoming: upcoming
      ? {
          amount: convertAmountToDollars(upcoming.amount),
          date: timestampToDate(upcoming.timestamp),
          items: upcoming.items,
        }
      : null,
  }),
  notImplementedAdapter.transformer
);

export default invoiceAdapter;
