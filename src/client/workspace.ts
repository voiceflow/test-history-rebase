import { BillingPeriod, PlanType, PlatformType, UserRole } from '@/constants';
import { DBBilling, DBProject, DBWorkspace, Price } from '@/models';

import invoiceAdapter from './adapters/invoice';
import memberAdapter from './adapters/member';
import projectAdapter from './adapters/project';
import workspaceAdapter from './adapters/workspace';
import fetch from './fetch';

export const LEGACY_WORKSPACE_PATH = 'team';
export const WORKSPACES_PATH = 'workspaces';

const workspaceClient = {
  find: () => fetch.get<DBWorkspace[]>(WORKSPACES_PATH).then(workspaceAdapter.mapFromDB),

  fetchWorkspace: (workspaceID: string) =>
    fetch.get<DBWorkspace>(`${WORKSPACES_PATH}/${workspaceID}`).then((data) => [workspaceAdapter.fromDB(data)]),

  createWorkspace: (data: { name: string; image?: string }) => fetch.post<DBWorkspace>(WORKSPACES_PATH, data).then(workspaceAdapter.fromDB),

  findMembers: (workspaceID: string) => fetch.get<DBWorkspace.Member[]>(`${WORKSPACES_PATH}/${workspaceID}/members`).then(memberAdapter.mapFromDB),

  updateMembers: (workspaceID: string, payload: { members: DBWorkspace.Member[] }) =>
    fetch.patch<DBWorkspace>(`${LEGACY_WORKSPACE_PATH}/${workspaceID}/members`, payload),

  createProjectFromModule: (
    workspaceID: string,
    moduleID: string,
    project: {
      name: string;
      locales: string[];
      platform: PlatformType;
      mainLocale?: string;
    }
  ) => fetch.post<DBProject>(`${LEGACY_WORKSPACE_PATH}/${workspaceID}/copy/module/${moduleID}`, project),

  findProjects: (workspaceID: string) => fetch.get<DBProject[]>(`${LEGACY_WORKSPACE_PATH}/${workspaceID}/projects`).then(projectAdapter.mapFromDB),

  deleteWorkspace: (workspaceID: string) => fetch.delete(`${WORKSPACES_PATH}/${workspaceID}`),

  leaveWorkspace: (workspaceID: string) => fetch.delete(`${WORKSPACES_PATH}/${workspaceID}/members/self`),

  removeMember: (workspaceID: string, creatorID: number) => fetch.delete(`${LEGACY_WORKSPACE_PATH}/${workspaceID}/member/${creatorID}`),

  updateName: (workspaceID: string, name: string) => fetch.patch(`${LEGACY_WORKSPACE_PATH}/${workspaceID}/update_name`, { name }),

  updateImage: (workspaceID: string, url: string) => fetch.post(`${LEGACY_WORKSPACE_PATH}/${workspaceID}/picture`, { url }),

  validateInvite: (invite: string) => fetch.post<string>(`${WORKSPACES_PATH}/invite/${invite}`),

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

  checkCoupon: (coupon: string) => fetch.get<{ data: string }>(`${WORKSPACES_PATH}/coupon/${coupon}`),
};

export default workspaceClient;
