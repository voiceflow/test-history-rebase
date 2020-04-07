import { createSelector } from 'reselect';

import { createRootSelector } from '../utils';
import { STATE_KEY, TestingState } from './types';

export const testingSelector = createRootSelector<TestingState>(STATE_KEY);

export const testingNLCSelector = createSelector(testingSelector, ({ nlc }) => nlc);

export const testingStatusSelector = createSelector(testingSelector, ({ status }) => status);

export const testingContextSelector = createSelector(testingSelector, ({ context }) => context);

export const testingIDSelector = createSelector(testingSelector, ({ ID }) => ID);

export const testingTimeSelector = createSelector(testingSelector, ({ startTime }) => startTime);

export const testingVariablesSelector = createSelector(testingContextSelector, ({ variables = {} }) => variables);
