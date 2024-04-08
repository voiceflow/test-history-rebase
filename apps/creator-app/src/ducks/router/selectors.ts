import { Location } from 'history';
import { matchPath } from 'react-router-dom';
import { createSelector } from 'reselect';

import { Path } from '@/config/routes';
import { PATH as ACTIONS_PATH } from '@/pages/Canvas/managers/components/Actions/constants';

import { createRootSelector } from '../utils';
import { STATE_KEY } from './constants';

export const rootSelector = createRootSelector(STATE_KEY);

export const locationSelector = createSelector(rootSelector, ({ location }) => location);

export const pathnameSelector = createSelector(locationSelector, ({ pathname }) => pathname);

export const actionsMatchSelector = createSelector(pathnameSelector, (pathname) =>
  matchPath<{ 0?: string; sourcePortID: string; actionNodeID: string }>(pathname, [
    `${Path.CANVAS_NODE}/${ACTIONS_PATH}`,
    `${Path.CANVAS_NODE}/*/${ACTIONS_PATH}`,
    `${Path.DOMAIN_CANVAS_NODE}/${ACTIONS_PATH}`,
    `${Path.DOMAIN_CANVAS_NODE}/*/${ACTIONS_PATH}`,
  ])
);

export const stateSelector = createSelector(
  locationSelector,
  (location: Location): Record<string, any> => (location.state && typeof location.state === 'object' ? location.state : {})
);
