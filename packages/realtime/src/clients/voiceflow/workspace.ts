import { BillingPeriod, PlanType, UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';

import { ExtraOptions } from './types';
import createResourceClient from './utils/resource';

const Client = ({ api }: ExtraOptions) => ({
  ...createResourceClient(api, 'workspaces'),

  get: (workspaceID: string) => api.get<Realtime.DBWorkspace>(`/workspaces/${workspaceID}`).then((res) => res.data),

  list: () => api.get<Realtime.DBWorkspace[]>(`/workspaces`).then((res) => res.data),

  create: (data: { name: string; image?: string }) => api.post<Realtime.DBWorkspace>('/workspaces', data).then((res) => res.data),

  checkout: (
    workspaceID: string,
    data: { plan: PlanType; seats: number; period: BillingPeriod; coupon?: string; source_id: string }
  ): Promise<void> => api.post(`/workspaces/${workspaceID}/checkout`, data),

  updateName: (workspaceID: string, name: string): Promise<void> => api.patch(`/team/${workspaceID}/update_name`, { name }),

  updateImage: (workspaceID: string, url: string): Promise<void> => api.post(`/team/${workspaceID}/picture`, { url }),

  delete: (workspaceID: string): Promise<void> => api.delete(`/v2/workspaces/${workspaceID}`),

  deleteStripeSubscription: (workspaceID: string): Promise<void> => api.delete(`/v2/workspaces/${workspaceID}'/stripe-subscription`),

  // members

  listMembers: (workspaceID: string) => api.get<Realtime.Member[]>(`/workspaces/${workspaceID}/members`).then((res) => res.data),

  patchMember: (workspaceID: string, memberCreatorID: number, data: Pick<Realtime.Member, 'role'>): Promise<void> =>
    api.patch(`/workspaces/${workspaceID}/members/${memberCreatorID}`, data),

  removeMember: (workspaceID: string, memberCreatorID: number): Promise<void> => api.delete(`/workspaces/${workspaceID}/members/${memberCreatorID}`),

  removeSelf: (workspaceID: string): Promise<void> => api.delete(`/workspaces/${workspaceID}/members/self`),

  sendInvite: (workspaceID: string, email: string, role?: UserRole) =>
    api.post<Realtime.Member | undefined>(`/workspaces/${workspaceID}/invite`, { email, role }).then((res) => res.data ?? null),

  acceptInvite: (invite: string) => api.post<string>(`/workspaces/invite/${invite}`).then((res) => res.data),

  updateInvite: (workspaceID: string, email: string, role?: UserRole): Promise<void> =>
    api.patch(`/workspaces/${workspaceID}/invite`, { email, role }),

  cancelInvite: (workspaceID: string, email: string): Promise<void> => api.delete(`/workspaces/${workspaceID}/invite`, { data: { email } }),

  getOrganization: (workspaceID: string) =>
    api.get<Realtime.Organization | undefined>(`/workspaces/${workspaceID}/organization`).then((res) => res.data),
});

export default Client;

export type WorkspaceClient = ReturnType<typeof Client>;
