import { createSelector } from 'reselect';

import { createSubSelector } from '@/ducks/utils';

import { createDesignerCRUDSelectors } from '../../utils/selector.util';
import { root as intentRoot } from '../selectors/root.select';
import { STATE_KEY } from './document.state';

const root = createSubSelector(intentRoot, STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } = createDesignerCRUDSelectors(root);

export const fetchStatus = createSelector(root, (state) => state.fetchStatus);

export const isLoaded = createSelector(fetchStatus, (status) => status !== 'loading' && status !== 'idle');
