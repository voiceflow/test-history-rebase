import { BillingPeriod, PlanType, UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';

import { ExtraOptions } from './types';

export interface WorkspaceClient {
  canRead: (creatorID: number, projectID: string) => Promise<boolean>;

  get: (workspaceID: string) => Promise<Realtime.DBWorkspace>;

  list: () => Promise<Realtime.DBWorkspace[]>;

  create: (data: { name: string; image?: string }) => Promise<Realtime.DBWorkspace>;

  checkout: (
    workspaceID: string,
    data: { plan: PlanType; seats: number; period: BillingPeriod; coupon?: string; source_id: string }
  ) => Promise<void>;

  updateName: (workspaceID: string, name: string) => Promise<void>;

  updateImage: (workspaceID: string, image: string) => Promise<void>;

  delete: (workspaceID: string) => Promise<void>;

  listMembers: (workspaceID: string) => Promise<Realtime.DBMember[]>;

  patchMember: (workspaceID: string, memberCreatorID: number, data: Pick<Realtime.DBMember, 'role'>) => Promise<void>;

  removeMember: (workspaceID: string, memberCreatorID: number) => Promise<void>;

  removeSelf: (workspaceID: string) => Promise<void>;

  sendInvite: (workspaceID: string, email: string, role?: UserRole) => Promise<Realtime.DBMember | null>;

  acceptInvite: (invite: string) => Promise<string>;

  updateInvite: (workspaceID: string, email: string, role?: UserRole) => Promise<void>;

  cancelInvite: (workspaceID: string, email: string) => Promise<void>;

  getOrganization: (workspaceID: string) => Promise<Realtime.Organization | undefined>;
}

const Client = ({ api }: ExtraOptions): WorkspaceClient => ({
  canRead: (creatorID, workspaceID) =>
    api
      .head(`/v2/user/${creatorID}/workspaces/${workspaceID}`)
      .then(() => true)
      .catch(() => false),

  get: (workspaceID) => api.get<Realtime.DBWorkspace>(`/workspaces/${workspaceID}`).then((res) => res.data),

  list: () => api.get<Realtime.DBWorkspace[]>(`/workspaces`).then((res) => res.data),

  create: (data) => api.post<Realtime.DBWorkspace>('/workspaces', data).then((res) => res.data),

  checkout: (workspaceID, data) => api.post(`/workspaces/${workspaceID}/checkout`, data),

  updateName: (workspaceID, name) => api.patch(`/team/${workspaceID}/update_name`, { name }),

  updateImage: (workspaceID, url) => api.post(`/team/${workspaceID}/picture`, { url }).then((res) => res.data),

  delete: (workspaceID) => api.delete(`/v2/workspaces/${workspaceID}`),

  // members

  listMembers: (workspaceID) => api.get<Realtime.DBMember[]>(`/workspaces/${workspaceID}/members`).then((res) => res.data),

  patchMember: (workspaceID, memberCreatorID, data) => api.patch(`/workspaces/${workspaceID}/members/${memberCreatorID}`, data),

  removeMember: (workspaceID, memberCreatorID) => api.delete(`/workspaces/${workspaceID}/members/${memberCreatorID}`),

  removeSelf: (workspaceID) => api.delete(`/workspaces/${workspaceID}/members/self`),

  sendInvite: (workspaceID, email, role) =>
    api.post<Realtime.DBMember | undefined>(`/workspaces/${workspaceID}/invite`, { email, role }).then((res) => res.data ?? null),

  acceptInvite: (invite) => api.post<string>(`/workspaces/invite/${invite}`).then((res) => res.data),

  updateInvite: (workspaceID, email, role) => api.patch(`/workspaces/${workspaceID}/invite`, { email, role }),

  cancelInvite: (workspaceID, email) => api.delete(`/workspaces/${workspaceID}/invite`, { data: { email } }),

  getOrganization: (workspaceID) => api.get<Realtime.Organization | undefined>(`/workspaces/${workspaceID}/organization`).then((res) => res.data),
});

export default Client;
