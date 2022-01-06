import { BillingPeriod, PlanType, UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { FetchOptions } from '@voiceflow/ui';

import { Price } from '@/models';
import { APIKey } from '@/models/APIKey';
import { DBBilling, DBPayment } from '@/models/Billing';

import invoiceAdapter from './adapters/invoice';
import { api, apiV2 } from './fetch';

export const LEGACY_WORKSPACE_PATH = 'team';
export const WORKSPACES_PATH = 'workspaces';

const workspaceClient = {
  find: (opt?: FetchOptions) => api.get<Realtime.DBWorkspace[]>(WORKSPACES_PATH, opt).then(Realtime.Adapters.workspaceAdapter.mapFromDB),

  fetchWorkspace: (workspaceID: string) =>
    api.get<Realtime.DBWorkspace>(`${WORKSPACES_PATH}/${workspaceID}`).then(Realtime.Adapters.workspaceAdapter.fromDB),

  createWorkspace: (data: { name: string; image?: string }) =>
    api.post<Realtime.DBWorkspace>(WORKSPACES_PATH, data).then(Realtime.Adapters.workspaceAdapter.fromDB),

  findMembers: (workspaceID: string) =>
    api.get<Realtime.DBMember[]>(`${WORKSPACES_PATH}/${workspaceID}/members`).then(Realtime.Adapters.memberAdapter.mapFromDB),

  deleteWorkspace: (workspaceID: string) => api.delete(`${WORKSPACES_PATH}/${workspaceID}`),

  leaveWorkspace: (workspaceID: string) => api.delete(`${WORKSPACES_PATH}/${workspaceID}/members/self`),

  updateName: (workspaceID: string, name: string) => api.patch(`${LEGACY_WORKSPACE_PATH}/${workspaceID}/update_name`, { name }),

  updateImage: (workspaceID: string, url: string) => api.post(`${LEGACY_WORKSPACE_PATH}/${workspaceID}/picture`, { url }),

  acceptInvite: (invite: string) => api.post<string>(`${WORKSPACES_PATH}/invite/${invite}`),

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

  checkout: (
    workspaceID: string,
    data: {
      plan: PlanType;
      seats: number;
      period: BillingPeriod;
      source_id: string;
      coupon?: string;
    }
  ) => api.post(`${WORKSPACES_PATH}/${workspaceID}/checkout`, data),

  updateMember: (workspaceID: string, creatorID: number, role: UserRole) =>
    api.patch(`${WORKSPACES_PATH}/${workspaceID}/members/${creatorID}`, { role }),

  deleteMember: (workspaceID: string, creatorID: number) => api.delete(`${WORKSPACES_PATH}/${workspaceID}/members/${creatorID}`),

  cancelInvite: (workspaceID: string, email: string) => api.delete(`${WORKSPACES_PATH}/${workspaceID}/invite`, { email }),

  updateInvite: (workspaceID: string, email: string, role: UserRole) => api.patch(`${WORKSPACES_PATH}/${workspaceID}/invite`, { email, role }),

  sendInvite: (workspaceID: string, email: string, role?: UserRole) =>
    api.post<Realtime.DBMember | void>(`${WORKSPACES_PATH}/${workspaceID}/invite`, { email, role }),

  getInviteLink: (workspaceID: string, role: UserRole) => api.post<string>(`${WORKSPACES_PATH}/${workspaceID}/inviteLink`, { role }),

  listAPIKeys: (workspaceID: string) => apiV2.get<APIKey[]>(`${WORKSPACES_PATH}/${workspaceID}/api-keys`),

  validateCoupon: (couponCode: string) => api.get<string>(`${WORKSPACES_PATH}/coupon/${couponCode}`).then((result) => result === 'true'),
};

export default workspaceClient;
