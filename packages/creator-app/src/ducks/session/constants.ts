import type { SessionState } from './types';

export const STATE_KEY = 'session';

export const INITIAL_STATE: Omit<SessionState, 'token' | 'browserID' | 'tabID' | 'activeWorkspaceID' | 'intercomUserHMAC'> = {
  intercomVisible: true,
  activeProjectID: null,
  activeVersionID: null,
  activeDiagramID: null,
  prototypeSidebarVisible: false,
};
