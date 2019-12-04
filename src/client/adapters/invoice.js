import moment from 'moment';

import { createSimpleAdapter } from './utils';

const timestampToDate = (timestamp) => {
  return moment.unix(timestamp).format('MMMM Do YYYY');
};

const convertAmountToDollars = (amount) => {
  return amount / 100;
};

const invoiceAdapter = createSimpleAdapter(
  ({ invoices, upcoming }) => {
    return {
      invoices: invoices?.map((invoice) => {
        const { status, amount, timestamp, items } = invoice;
        return {
          status,
          amount: convertAmountToDollars(amount),
          date: timestampToDate(timestamp),
          items,
        };
      }),
      upcoming: upcoming
        ? {
            amount: convertAmountToDollars(upcoming.amount),
            date: timestampToDate(upcoming.timestamp),
            items: upcoming.items,
          }
        : null,
    };
  },
  () => ({})
);

export default invoiceAdapter;
