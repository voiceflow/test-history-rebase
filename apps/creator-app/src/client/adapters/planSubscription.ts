import { createSimpleAdapter, notImplementedAdapter } from 'bidirectional-adapter';
import dayjs from 'dayjs';

import type { DBPlanSubscription, PlanSubscription } from '@/models';

const timestampToDate = (timestamp: number) => dayjs.unix(timestamp).format('DD MMM YY');

const planSubscriptionAdapter = createSimpleAdapter<DBPlanSubscription, PlanSubscription>(
  ({ nextBillingDate, ...subscription }) => ({
    ...subscription,
    billingPeriod: subscription.interval,
    nextBillingDate: timestampToDate(nextBillingDate),
  }),
  notImplementedAdapter.transformer
);

export default planSubscriptionAdapter;
