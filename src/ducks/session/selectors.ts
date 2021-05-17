import { createSelector } from 'reselect';

import { createRootSelector } from '@/ducks/utils';

import { STATE_KEY } from './constants';

const rootSelector = createRootSelector(STATE_KEY);

export const authTokenSelector = createSelector([rootSelector], ({ token }) => token.value);

export const tabIDSelector = createSelector([rootSelector], ({ tabID }) => tabID);

export const browserIDSelector = createSelector([rootSelector], ({ browserID }) => browserID);

export const isWebsocketsEnabledSelector = createSelector([rootSelector], ({ websocketsEnabled }) => websocketsEnabled);

export const isIntercomVisibleSelector = createSelector([rootSelector], ({ intercomVisible }) => intercomVisible);

export const intercomUserHMACSelector = createSelector([rootSelector], ({ intercomUserHMAC }) => intercomUserHMAC);

// DO NOT RELY ON SESSIONS FOR WORKSPACE *YET*
// export const activeWorkspaceIDSelector = createSelector([rootSelector], ({ activeWorkspaceID }) => activeWorkspaceID);
// export const hasActiveWorkspaceSelector = createSelector([activeWorkspaceIDSelector], (id) => !!id);

export const activeProjectIDSelector = createSelector([rootSelector], ({ activeProjectID }) => activeProjectID);
export const hasActiveProjectSelector = createSelector([activeProjectIDSelector], (id) => !!id);

export const activeVersionIDSelector = createSelector([rootSelector], ({ activeVersionID }) => activeVersionID);
export const hasActiveVersionSelector = createSelector([activeVersionIDSelector], (id) => !!id);

export const activeDiagramIDSelector = createSelector([rootSelector], ({ activeDiagramID }) => activeDiagramID);
export const hasActiveDiagramSelector = createSelector([activeDiagramIDSelector], (id) => !!id);
