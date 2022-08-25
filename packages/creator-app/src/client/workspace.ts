import { BillingPeriod, PlanType, UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';

import { APIKey, DBBilling, DBPayment, Price } from '@/models';

import invoiceAdapter from './adapters/invoice';
import { api, apiV2 } from './fetch';

export const WORKSPACES_PATH = 'workspaces';

const workspaceClient = {
  validateInvite: (invite: string) => api.get<boolean>(`${WORKSPACES_PATH}/invite/${invite}`).catch(() => false),

  getInvoice: (workspaceID: string) => api.get<DBBilling>(`${WORKSPACES_PATH}/${workspaceID}/invoice`).then(invoiceAdapter.fromDB),

  getPlans: () => api.get<DBPayment[]>(`${WORKSPACES_PATH}/plans`),

  getPlan: (workspaceID: string) => api.get<DBPayment>(`${WORKSPACES_PATH}/${workspaceID}/plan`),

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

  getInviteLink: (workspaceID: string, role: UserRole) => api.post<string>(`${WORKSPACES_PATH}/${workspaceID}/inviteLink`, { role }),

  listAPIKeys: (workspaceID: string) => apiV2.get<APIKey[]>(`${WORKSPACES_PATH}/${workspaceID}/api-keys`),

  validateCoupon: (couponCode: string) => api.get<string>(`${WORKSPACES_PATH}/coupon/${couponCode}`).then((result) => result === 'true'),

  getOrganization: (workspaceID: string) => api.get<Realtime.Organization | undefined>(`${WORKSPACES_PATH}/${workspaceID}/organization`),
};

export default workspaceClient;
