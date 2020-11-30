import { BillingPeriod, PlanType, UserRole } from '@/constants';
import { DBWorkspace, Price } from '@/models';
import { DBBilling } from '@/models/Billing';

import invoiceAdapter from './adapters/invoice';
import memberAdapter from './adapters/member';
import workspaceAdapter from './adapters/workspace';
import fetch from './fetch';

export const LEGACY_WORKSPACE_PATH = 'team';
export const WORKSPACES_PATH = 'workspaces';

const workspaceClient = {
  find: () => fetch.get<DBWorkspace[]>(WORKSPACES_PATH).then(workspaceAdapter.mapFromDB),

  // TODO: seems legacy
  fetchWorkspace: (workspaceID: string) =>
    fetch.get<DBWorkspace>(`${WORKSPACES_PATH}/${workspaceID}`).then((data) => [workspaceAdapter.fromDB(data)]),

  createWorkspace: (data: { name: string; image?: string }) => fetch.post<DBWorkspace>(WORKSPACES_PATH, data).then(workspaceAdapter.fromDB),

  findMembers: (workspaceID: string) => fetch.get<DBWorkspace.Member[]>(`${WORKSPACES_PATH}/${workspaceID}/members`).then(memberAdapter.mapFromDB),

  updateMembers: (workspaceID: string, payload: { members: DBWorkspace.Member[] }) =>
    fetch.patch<DBWorkspace>(`${LEGACY_WORKSPACE_PATH}/${workspaceID}/members`, payload),

  deleteWorkspace: (workspaceID: string) => fetch.delete(`${WORKSPACES_PATH}/${workspaceID}`),

  leaveWorkspace: (workspaceID: string) => fetch.delete(`${WORKSPACES_PATH}/${workspaceID}/members/self`),

  updateName: (workspaceID: string, name: string) => fetch.patch(`${LEGACY_WORKSPACE_PATH}/${workspaceID}/update_name`, { name }),

  updateImage: (workspaceID: string, url: string) => fetch.post(`${LEGACY_WORKSPACE_PATH}/${workspaceID}/picture`, { url }),

  acceptInvite: (invite: string) => fetch.post<string>(`${WORKSPACES_PATH}/invite/${invite}`),

  validateInvite: (invite: string) => fetch.get<boolean>(`${WORKSPACES_PATH}/invite/${invite}`),

  getInvoice: (workspaceID: string) => fetch.get<DBBilling>(`${WORKSPACES_PATH}/${workspaceID}/invoice`).then(invoiceAdapter.fromDB),

  getPlans: () => fetch.get(`${WORKSPACES_PATH}/plans`),

  getPlan: (workspaceID: string) => fetch.get(`${WORKSPACES_PATH}/${workspaceID}/plan`),

  updateSource: (workspaceID: string, sourceID: string) => fetch.patch(`${WORKSPACES_PATH}/${workspaceID}/source`, { source_id: sourceID }),

  calculatePrice: (
    workspaceID: string | null,
    data: {
      plan: PlanType;
      seats: number;
      period: BillingPeriod;
      coupon?: string;
    }
  ) => fetch.post<Price>(`${WORKSPACES_PATH}/${workspaceID}/price`, data),

  checkout: (
    workspaceID: string,
    data: {
      plan: PlanType;
      seats: number;
      period: BillingPeriod;
      source_id: string;
      coupon?: string;
    }
  ) => fetch.post(`${WORKSPACES_PATH}/${workspaceID}/checkout`, data),

  updateMember: (workspaceID: string, creatorID: number, role: UserRole) =>
    fetch.patch(`${WORKSPACES_PATH}/${workspaceID}/members/${creatorID}`, { role }),

  deleteMember: (workspaceID: string, creatorID: number) => fetch.delete(`${WORKSPACES_PATH}/${workspaceID}/members/${creatorID}`),

  cancelInvite: (workspaceID: string, email: string) => fetch.delete(`${WORKSPACES_PATH}/${workspaceID}/invite`, { email }),

  updateInvite: (workspaceID: string, email: string, role: UserRole) => fetch.patch(`${WORKSPACES_PATH}/${workspaceID}/invite`, { email, role }),

  sendInvite: (workspaceID: string, email: string, role: UserRole) =>
    fetch.post<DBWorkspace.Member | void>(`${WORKSPACES_PATH}/${workspaceID}/invite`, { email, role }),

  getInviteLink: (workspaceID: string, role: UserRole) => fetch.post<string>(`${WORKSPACES_PATH}/${workspaceID}/inviteLink`, { role }),
};

export default workspaceClient;
