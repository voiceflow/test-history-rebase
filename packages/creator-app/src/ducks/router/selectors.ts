import { Location } from 'history';
import { createSelector } from 'reselect';

import { createRootSelector } from '../utils';
import { STATE_KEY } from './constants';

export const rootSelector = createRootSelector(STATE_KEY);

export const locationSelector = createSelector(rootSelector, ({ location }) => location);

export const pathnameSelector = createSelector(locationSelector, ({ pathname }) => pathname);

export const stateSelector = createSelector(
  locationSelector,
  (location: Location): Record<string, any> => (location.state && typeof location.state === 'object' ? location.state : {})
);
