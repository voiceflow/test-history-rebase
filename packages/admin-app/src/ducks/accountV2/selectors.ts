import { createSelector } from 'reselect';

import { createRootSelector } from '@/store/utils';

import { STATE_KEY } from './constants';

const rootSelector = createRootSelector(STATE_KEY);

export const accountSelector = createSelector([rootSelector], (account) => account);
