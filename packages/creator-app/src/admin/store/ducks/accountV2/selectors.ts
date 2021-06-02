/* eslint-disable import/prefer-default-export */
import { createSelector } from 'reselect';

import { createRootSelector } from '@/admin/store/utils';

import { STATE_KEY } from './constants';

const rootSelector = createRootSelector(STATE_KEY);

export const accountSelector = createSelector([rootSelector], (account) => account);
