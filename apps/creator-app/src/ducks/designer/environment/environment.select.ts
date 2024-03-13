import { createSelector } from 'reselect';

import { createDesignerSelector } from '../utils/selector.util';
import { STATE_KEY } from './environment.state';

export const root = createDesignerSelector(STATE_KEY);

export const nluTrainingDiff = createSelector([root], (state) => state.nluTrainingDiff);
export const nluTrainingDiffData = createSelector([nluTrainingDiff], ({ data }) => data);
export const nluTrainingDiffStatus = createSelector([nluTrainingDiff], ({ status }) => status);
