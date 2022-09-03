import type { SessionState } from './types';

export const STATE_KEY = 'session';

export const INITIAL_STATE: Omit<SessionState, 'token' | 'browserID' | 'tabID' | 'activeWorkspaceID' | 'intercomUserHMAC'> = {
  activeDomainID: null,
  activeProjectID: null,
  activeVersionID: null,
  activeDiagramID: null,
  intercomVisible: true,
  prototypeSidebarVisible: false,
};
