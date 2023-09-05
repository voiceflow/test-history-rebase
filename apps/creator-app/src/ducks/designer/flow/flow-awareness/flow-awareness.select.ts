import { createSelector } from 'reselect';

import { createSubSelector } from '@/ducks/utils';

import { root as flowRoot } from '../selectors/root.select';
import { STATE_KEY } from './flow-awareness.state';

export const root = createSubSelector(flowRoot, STATE_KEY);

export const locks = createSelector([root], ({ locks }) => locks);
