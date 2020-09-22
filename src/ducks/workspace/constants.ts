import { WorkspaceState } from './types';

export class NoValidTemplateError extends Error {
  constructor() {
    super('no valid template exists');
  }
}

export const STATE_KEY = 'workspace';

export const INITIAL_STATE: WorkspaceState = {
  allIds: [],
  byId: {},
  activeWorkspaceID: localStorage.getItem('team'),
};

export const TEMPLATES_ADMIN_ID = 36745;
export const TEMPLATES_EDITORS_ID = [3600];
