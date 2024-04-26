import { createSelector } from 'reselect';

import { authTokenSelector } from '@/ducks/session/selectors';
import { createRootSelector } from '@/ducks/utils';

import { STATE_KEY } from './constants';

export const userSelector = createRootSelector(STATE_KEY);

export const userIDSelector = createSelector([userSelector], ({ creator_id }) => creator_id);

export const userNameSelector = createSelector([userSelector], ({ name }) => name);

export const isFirstLoginSelector = createSelector([userSelector], ({ first_login }) => first_login);

export const userEmailSelector = createSelector([userSelector], ({ email }) => email);

export const userVerifiedSelector = createSelector([userSelector], ({ verified }) => verified);

export const amazonAccountSelector = createSelector([userSelector], ({ amazon }) => amazon);

export const amazonVendorsSelector = createSelector([amazonAccountSelector], (amazon) => amazon?.vendors ?? []);

export const googleAccountSelector = createSelector([userSelector], ({ google }) => google);

export const googleEmailSelector = createSelector([googleAccountSelector], (google) => google?.profile?.email || '0');

export const isLoggingInSelector = createSelector(
  [authTokenSelector, userIDSelector],
  (token, creatorID) => !!token && creatorID === null
);

export const isLoggedInSelector = createSelector(
  [authTokenSelector, userIDSelector],
  (authToken, creatorID) => !!(authToken && creatorID)
);
