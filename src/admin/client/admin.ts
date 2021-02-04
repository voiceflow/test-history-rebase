import axios from 'axios';

import { UpdateType } from '@/admin/models';

const ADMIN_API = 'admin-api';

const adminClient = {
  getCreatorByEmail: (email: string) => axios.get(`${ADMIN_API}/email/${email}`),
  getCreatorByID: (userID: number) => axios.get(`${ADMIN_API}/${userID}`),
  getCharges: (creatorID: number) => axios.get(`${ADMIN_API}/charges/${creatorID}`),
  getVendors: (creatorID: number) => axios.get(`${ADMIN_API}/vendors/${creatorID}`),
  setTrial: (workspaceID: number, date = 0) => axios.post(`${ADMIN_API}/trial/${workspaceID}/${date}`),
  refund: ({ workspaceID, chargeID, chargeAmount }: { workspaceID: number; chargeID: string; chargeAmount: number }) =>
    axios.post(`${ADMIN_API}/refund/${workspaceID}/${chargeID}/${chargeAmount}`),
  cancelSubscription: (workspaceID: number, subscriptionID: string) => axios.post(`${ADMIN_API}/cancel/${workspaceID}/${subscriptionID}`),
  updateWorkspace: (workspaceID: number, data: any) => axios.patch(`${ADMIN_API}/workspace/${workspaceID}`, data),
  updateMemberRole: ({ workspaceID, creatorID, role }: { workspaceID: number; creatorID: number; role: string }) =>
    axios.patch(`${ADMIN_API}/workspace/${workspaceID}/members/${creatorID}`, { role }),
  getCoupons: () => axios.get(`${ADMIN_API}/stripe/coupons`),
  /*
   * there is no endpoint to get beta users,
   * this call was added by Frank and Eric more than a year ago.
   * there is no reference to why this was added
   */
  getBetaUsers: () => axios.get(`${ADMIN_API}`),
  getUserTeams: (user: number) => axios.get(`/teams/${user}`),
  setProductUpdate: (update: { type: UpdateType; details: unknown }) => axios.post('/product_updates', update),
};

export default adminClient;
