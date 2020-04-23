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
