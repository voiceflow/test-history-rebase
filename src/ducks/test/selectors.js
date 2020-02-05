import { createSelector } from 'reselect';

import { createRootSelector } from '../utils';
import { STATE_KEY } from './constants';

export const testSelector = createRootSelector(STATE_KEY);

export const testStatusSelector = createSelector(
  testSelector,
  ({ status }) => status
);

export const testStateSelector = createSelector(
  testSelector,
  ({ state }) => state
);

export const testDialogSelector = createSelector(
  testSelector,
  ({ dialog }) => dialog
);

export const userTestSelector = createSelector(
  testSelector,
  ({ userTest }) => userTest
);

export const testTimeSelector = createSelector(
  testSelector,
  ({ startTime }) => startTime
);

export const testDisplaySelector = createSelector(
  testSelector,
  ({ state: { display_info } }) => display_info
);

export const testGlobalsSelector = createSelector(
  testSelector,
  ({ state: { globals } }) => globals[0]
);
