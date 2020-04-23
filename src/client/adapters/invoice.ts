import moment from 'moment';

import { Billing, DBBilling } from '@/models';

import { AdapterNotImplementedError, createSimpleAdapter } from './utils';

const timestampToDate = (timestamp: number) => moment.unix(timestamp).format('MMMM Do YYYY');

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
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default invoiceAdapter;
