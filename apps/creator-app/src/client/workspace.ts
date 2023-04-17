import { BillingPeriod, PlanType } from '@voiceflow/internal';

import { APIKey, DBBilling, DBPayment, DBPlan, DBPlanSubscription, Price, SubscriptionBillingPeriod } from '@/models';

import invoiceListAdapter from './adapters/invoicesList';
import planSubscriptionAdapter from './adapters/planSubscription';
import { api, apiV2 } from './fetch';

export const WORKSPACES_PATH = 'workspaces';

const workspaceClient = {
  getPlan: (workspaceID: string) => api.get<DBPayment>(`${WORKSPACES_PATH}/${workspaceID}/plan`),

  getPlans: () => api.get<DBPlan[]>(`${WORKSPACES_PATH}/plans`),

  updateSource: (workspaceID: string, sourceID: string) => api.patch(`${WORKSPACES_PATH}/${workspaceID}/source`, { source_id: sourceID }),

  calculatePrice: (
    workspaceID: string | null,
    data: {
      plan: PlanType;
      seats: number;
      period: BillingPeriod;
      coupon?: string;
      onlyVerified?: boolean;
    }
  ) => api.post<Price>(`${WORKSPACES_PATH}/${workspaceID}/price`, data),

  validateCoupon: (couponCode: string) => api.get<string>(`${WORKSPACES_PATH}/coupon/${couponCode}`).then((result) => result === 'true'),

  getInvoices: (workspaceID: string, cursor: string | null, limit: number) => {
    return apiV2
      .get<DBBilling.InvoiceList>(`${WORKSPACES_PATH}/${workspaceID}/invoices?limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`)
      .then(invoiceListAdapter.fromDB);
  },

  getPlanSubscription: (workspaceID: string) => {
    return apiV2.get<DBPlanSubscription>(`${WORKSPACES_PATH}/${workspaceID}/plan-subscription`).then(planSubscriptionAdapter.fromDB);
  },

  getUsageSubscription: (workspaceID: string) => {
    return apiV2.get<SubscriptionBillingPeriod>(`${WORKSPACES_PATH}/${workspaceID}/usage-subscription`);
  },

  cancelSubscription: (workspaceID: string) => {
    return apiV2.post(`${WORKSPACES_PATH}/${workspaceID}/subscription/plan/cancel`);
  },
  listAPIKeys: (workspaceID: string) => apiV2.get<APIKey[]>(`${WORKSPACES_PATH}/${workspaceID}/api-keys`),
};

export default workspaceClient;
