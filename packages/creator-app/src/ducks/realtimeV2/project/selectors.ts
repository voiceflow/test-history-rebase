import { createSelector } from 'reselect';

import { createRootSelector } from '../utils';
import { PROJECT_STATE_KEY } from './constants';

const rootSelector = createRootSelector(PROJECT_STATE_KEY);

// eslint-disable-next-line import/prefer-default-export
export const projectStateSelector = createSelector(
  [rootSelector],
  (state) => (projectID: string) => Object.prototype.hasOwnProperty.call(state, projectID) ? state[projectID] : null
);
