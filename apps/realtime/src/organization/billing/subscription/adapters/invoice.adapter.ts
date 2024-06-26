import type { Invoice } from '@voiceflow/dtos';
import type { SubscriptionsControllerGetSubscriptionInvoices200InvoicesItem } from '@voiceflow/sdk-billing/generated';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';
import dayjs from 'dayjs';

const timestampToDate = (timestamp: number) => dayjs.unix(timestamp).format('DD MMM YY');

export const invoiceAdapter = createMultiAdapter<
  SubscriptionsControllerGetSubscriptionInvoices200InvoicesItem,
  Invoice
>(
  ({ id, date }) => ({
    id,
    date: date ? timestampToDate(date) : null,
  }),
  notImplementedAdapter.transformer
);
