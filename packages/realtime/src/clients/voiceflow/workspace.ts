import { BillingPeriod, PlanType } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

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

  changeSeats: (workspaceID: string, { seats, schedule }: { seats: number; schedule?: boolean }): Promise<void> =>
    api.post(`/v2/workspaces/${workspaceID}/subscription/plan/seats`, { seats, prorate: !schedule }),

  deleteStripeSubscription: (workspaceID: string): Promise<void> => api.delete(`/v2/workspaces/${workspaceID}'/stripe-subscription`),
});

export default Client;

export type WorkspaceClient = ReturnType<typeof Client>;
