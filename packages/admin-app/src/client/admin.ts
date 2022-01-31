import { api } from '@/client/fetch';
import { Board, Creator, Team, UpdateType } from '@/models';

const ADMIN_API = 'admin-api';

const adminClient = {
  getCreatorByEmail: (email: string): Promise<{ creator: Creator; boards: Board[] }> => api.get(`${ADMIN_API}/email/${email}`),
  getCreatorByID: (userID: number): Promise<{ creator: Creator; boards: Board[] }> => api.get(`${ADMIN_API}/${userID}`),
  getCharges: (creatorID: number): Promise<{ teams: Team[] }> => api.get(`${ADMIN_API}/charges/${creatorID}`),
  getVendors: (creatorID: number): Promise<{ vendors: any[] }> => api.get(`${ADMIN_API}/vendors/${creatorID}`),
  setTrial: (workspaceID: number, date = 0) => api.post(`${ADMIN_API}/trial/${workspaceID}/${date}`),
  refund: ({ workspaceID, chargeID, chargeAmount }: { workspaceID: number; chargeID: string; chargeAmount: number }) =>
    api.post(`${ADMIN_API}/refund/${workspaceID}/${chargeID}/${chargeAmount}`),
  cancelSubscription: (workspaceID: number, subscriptionID: string) => api.post(`${ADMIN_API}/cancel/${workspaceID}/${subscriptionID}`),
  updateWorkspace: (workspaceID: number, data: any) => api.patch(`${ADMIN_API}/workspace/${workspaceID}`, data),
  updateMemberRole: ({ workspaceID, creatorID, role }: { workspaceID: number; creatorID: number; role: string }) =>
    api.patch(`${ADMIN_API}/workspace/${workspaceID}/members/${creatorID}`, { role }),
  getUserTeams: (user: number): Promise<Team[]> => api.get(`teams/${user}`),
  setProductUpdate: (update: { type: UpdateType; details: unknown }) => api.post('product_updates', update),
};

export default adminClient;
