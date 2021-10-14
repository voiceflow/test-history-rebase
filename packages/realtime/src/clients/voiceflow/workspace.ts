import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';

import { ExtraOptions } from './types';

export interface WorkspaceClient {
  canRead: (creatorID: number, projectID: string) => Promise<boolean>;

  get: (workspaceID: string) => Promise<Realtime.DBWorkspace>;

  list: () => Promise<Realtime.DBWorkspace[]>;

  create: (data: { name: string; image?: string }) => Promise<Realtime.DBWorkspace>;

  updateName: (workspaceID: string, name: string) => Promise<void>;

  updateImage: (workspaceID: string, image: string) => Promise<void>;

  delete: (workspaceID: string) => Promise<void>;

  listMembers: (workspaceID: string) => Promise<Realtime.DBMember[]>;

  patchMember: (creatorID: number, workspaceID: string, data: Pick<Realtime.DBMember, 'role'>) => Promise<void>;

  removeMember: (creatorID: number, workspaceID: string) => Promise<void>;

  removeSelf: (workspaceID: string) => Promise<void>;

  sendInvite: (workspaceID: string, email: string, role?: UserRole) => Promise<Realtime.DBMember | null>;

  acceptInvite: (invite: string) => Promise<string>;

  updateInvite: (workspaceID: string, email: string, role?: UserRole) => Promise<void>;

  cancelInvite: (workspaceID: string, email: string) => Promise<void>;
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

  updateName: (workspaceID, name) => api.patch(`/team/${workspaceID}/update_name`, { name }),

  updateImage: (workspaceID, url) => api.patch(`/team/${workspaceID}/picture`, { url }).then((res) => res.data),

  delete: (workspaceID) => api.delete(`/workspaces/${workspaceID}`),

  // members

  listMembers: (workspaceID) => api.get<Realtime.DBMember[]>(`/workspaces/${workspaceID}/members`).then((res) => res.data),

  patchMember: (creatorID, workspaceID, data) => api.patch(`/workspaces/${workspaceID}/members/${creatorID}`, data),

  removeMember: (creatorID, workspaceID) => api.delete(`/workspaces/${workspaceID}/members/${creatorID}`),

  removeSelf: (workspaceID) => api.delete(`/workspaces/${workspaceID}/members/self`),

  sendInvite: (workspaceID, email, role) =>
    api.post<Realtime.DBMember | undefined>(`/workspaces/${workspaceID}/invite`, { email, role }).then((res) => res.data ?? null),

  acceptInvite: (invite) => api.post<string>(`/workspaces/invite/${invite}`).then((res) => res.data),

  updateInvite: (workspaceID, email, role) => api.patch(`/workspaces/${workspaceID}/invite`, { email, role }),

  cancelInvite: (workspaceID, email) => api.delete(`/workspaces/${workspaceID}/invite`, { data: { email } }),
});

export default Client;
