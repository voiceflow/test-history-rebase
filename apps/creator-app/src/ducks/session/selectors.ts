import { createSelector } from 'reselect';

import { createRootSelector } from '@/ducks/utils/selector';

import { STATE_KEY } from './constants';

const rootSelector = createRootSelector(STATE_KEY);

export const authTokenSelector = createSelector([rootSelector], ({ token }) => token.value);

export const tabIDSelector = createSelector([rootSelector], ({ tabID }) => tabID);

export const browserIDSelector = createSelector([rootSelector], ({ browserID }) => browserID);

export const anonymousIDSelector = createSelector([rootSelector], ({ anonymousID }) => anonymousID);

export const activeWorkspaceIDSelector = createSelector([rootSelector], ({ activeWorkspaceID }) => activeWorkspaceID);
export const hasActiveWorkspaceSelector = createSelector([activeWorkspaceIDSelector], (id) => !!id);

export const activeProjectIDSelector = createSelector([rootSelector], ({ activeProjectID }) => activeProjectID);
export const hasActiveProjectSelector = createSelector([activeProjectIDSelector], (id) => !!id);

export const activeVersionIDSelector = createSelector([rootSelector], ({ activeVersionID }) => activeVersionID);
export const hasActiveVersionSelector = createSelector([activeVersionIDSelector], (id) => !!id);

export const activeDiagramIDSelector = createSelector([rootSelector], ({ activeDiagramID }) => activeDiagramID);
export const hasActiveDiagramSelector = createSelector([activeDiagramIDSelector], (id) => !!id);

export const activeDomainIDSelector = createSelector([rootSelector], ({ activeDomainID }) => activeDomainID);
export const hasActiveDomainSelector = createSelector([activeDomainIDSelector], (id) => !!id);

export const activeFlowIDSelector = createSelector([rootSelector], ({ activeFlowID }) => activeFlowID);
export const hasActiveFlowSelector = createSelector([activeFlowIDSelector], (id) => !!id);

export const isPrototypeSidebarVisibleSelector = createSelector([rootSelector], ({ prototypeSidebarVisible }) => prototypeSidebarVisible);
