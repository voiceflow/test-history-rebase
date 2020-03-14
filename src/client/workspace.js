import invoiceAdapter from './adapters/invoice';
import memberAdapter from './adapters/member';
import projectAdapter from './adapters/project';
import workspaceAdapter from './adapters/workspace';
import fetch from './fetch';

export const LEGACY_WORKSPACE_PATH = 'team';
export const WORKSPACES_PATH = 'workspaces';

const workspaceClient = {
  find: () => fetch.get(WORKSPACES_PATH).then(workspaceAdapter.mapFromDB),

  fetchWorkspace: (workspaceID) => fetch.get(`${WORKSPACES_PATH}/${workspaceID}`).then((data) => workspaceAdapter.mapFromDB([data])),

  createWorkspace: (data) => fetch.post(WORKSPACES_PATH, data).then(workspaceAdapter.fromDB),

  findMembers: (workspaceID) => fetch.get(`${WORKSPACES_PATH}/${workspaceID}/members`).then(memberAdapter.mapFromDB),

  updateMembers: (workspaceID, payload) => fetch.patch(`${LEGACY_WORKSPACE_PATH}/${workspaceID}/members`, payload),

  createProjectFromModule: (workspaceID, moduleID, project) => fetch.post(`${LEGACY_WORKSPACE_PATH}/${workspaceID}/copy/module/${moduleID}`, project),

  findProjects: (workspaceID) => fetch.get(`${LEGACY_WORKSPACE_PATH}/${workspaceID}/projects`).then(projectAdapter.mapFromDB),

  deleteWorkspace: (workspaceID) => fetch.delete(`${WORKSPACES_PATH}/${workspaceID}`),

  leaveWorkspace: (workspaceID) => fetch.delete(`${WORKSPACES_PATH}/${workspaceID}/members/self`),

  removeMember: (workspaceID, userID) => fetch.delete(`${LEGACY_WORKSPACE_PATH}/${workspaceID}/member/${userID}`),

  updateName: (workspaceID, name) => fetch.patch(`${LEGACY_WORKSPACE_PATH}/${workspaceID}/update_name`, { name }),

  validateInvite: (invite) => fetch.post(`${WORKSPACES_PATH}/invite/${invite}`),

  getInvoice: (workspaceID) => fetch.get(`${WORKSPACES_PATH}/${workspaceID}/invoice`).then(invoiceAdapter.fromDB),

  getPlans: () => fetch.get(`${WORKSPACES_PATH}/plans`),

  getPlan: (workspaceID) => fetch.get(`${WORKSPACES_PATH}/${workspaceID}/plan`),

  updateSource: (workspaceID, sourceID) => fetch.patch(`${WORKSPACES_PATH}/${workspaceID}/source`, { source_id: sourceID }),

  calculatePrice: (workspaceID, data) => fetch.post(`${WORKSPACES_PATH}/${workspaceID}/price`, data),

  checkout: (workspaceID, data) => fetch.post(`${WORKSPACES_PATH}/${workspaceID}/checkout`, data),

  updateMember: (workspaceID, creatorID, role) => fetch.patch(`${WORKSPACES_PATH}/${workspaceID}/members/${creatorID}`, { role }),

  deleteMember: (workspaceID, creatorID) => fetch.delete(`${WORKSPACES_PATH}/${workspaceID}/members/${creatorID}`),

  cancelInvite: (workspaceID, email) => fetch.delete(`${WORKSPACES_PATH}/${workspaceID}/invite`, { email }),

  updateInvite: (workspaceID, email, role) => fetch.patch(`${WORKSPACES_PATH}/${workspaceID}/invite`, { email, role }),

  sendInvite: (workspaceID, email, role) => fetch.post(`${WORKSPACES_PATH}/${workspaceID}/invite`, { email, role }),
};

export default workspaceClient;
