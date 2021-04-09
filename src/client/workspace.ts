import { BillingPeriod, PlanType, UserRole } from '@/constants';
import { DBWorkspace, Price } from '@/models';
import { APIKey } from '@/models/APIKey';
import { DBBilling } from '@/models/Billing';

import invoiceAdapter from './adapters/invoice';
import memberAdapter from './adapters/member';
import workspaceAdapter from './adapters/workspace';
import { api, apiV2 } from './fetch';
import { FetchOptions } from './fetch/types';

export const LEGACY_WORKSPACE_PATH = 'team';
export const WORKSPACES_PATH = 'workspaces';

const workspaceClient = {
  find: (opt?: FetchOptions) => api.get<DBWorkspace[]>(WORKSPACES_PATH, opt).then(workspaceAdapter.mapFromDB),

  // TODO: seems legacy
  fetchWorkspace: (workspaceID: string) => api.get<DBWorkspace>(`${WORKSPACES_PATH}/${workspaceID}`).then((data) => [workspaceAdapter.fromDB(data)]),

  createWorkspace: (data: { name: string; image?: string }) => api.post<DBWorkspace>(WORKSPACES_PATH, data).then(workspaceAdapter.fromDB),

  findMembers: (workspaceID: string) => api.get<DBWorkspace.Member[]>(`${WORKSPACES_PATH}/${workspaceID}/members`).then(memberAdapter.mapFromDB),

  updateMembers: (workspaceID: string, payload: { members: DBWorkspace.Member[] }) =>
    api.patch<DBWorkspace>(`${LEGACY_WORKSPACE_PATH}/${workspaceID}/members`, payload),

  deleteWorkspace: (workspaceID: string) => api.delete(`${WORKSPACES_PATH}/${workspaceID}`),

  leaveWorkspace: (workspaceID: string) => api.delete(`${WORKSPACES_PATH}/${workspaceID}/members/self`),

  updateName: (workspaceID: string, name: string) => api.patch(`${LEGACY_WORKSPACE_PATH}/${workspaceID}/update_name`, { name }),

  updateImage: (workspaceID: string, url: string) => api.post(`${LEGACY_WORKSPACE_PATH}/${workspaceID}/picture`, { url }),

  acceptInvite: (invite: string) => api.post<string>(`${WORKSPACES_PATH}/invite/${invite}`),

  validateInvite: (invite: string) => api.get<boolean>(`${WORKSPACES_PATH}/invite/${invite}`),

  getInvoice: (workspaceID: string) => api.get<DBBilling>(`${WORKSPACES_PATH}/${workspaceID}/invoice`).then(invoiceAdapter.fromDB),

  getPlans: () => api.get(`${WORKSPACES_PATH}/plans`),

  getPlan: (workspaceID: string) => api.get(`${WORKSPACES_PATH}/${workspaceID}/plan`),

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

  sendInvite: (workspaceID: string, email: string, role: UserRole) =>
    api.post<DBWorkspace.Member | void>(`${WORKSPACES_PATH}/${workspaceID}/invite`, { email, role }),

  getInviteLink: (workspaceID: string, role: UserRole) => api.post<string>(`${WORKSPACES_PATH}/${workspaceID}/inviteLink`, { role }),

  listAPIKeys: (workspaceID: string) => apiV2.get<APIKey[]>(`${WORKSPACES_PATH}/${workspaceID}/api-keys`),

  validateCoupon: (couponCode: string) => api.get<boolean>(`${WORKSPACES_PATH}/coupon/${couponCode}`),
};

export default workspaceClient;
