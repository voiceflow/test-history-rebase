import { createSelector } from 'reselect';

import { createSubSelector } from '@/ducks/utils';

import { createByFolderIDSelectors, createDesignerCRUDSelectors } from '../../utils/selector.util';
import { root as kbRoot } from '../knowledge-base.select';
import { STATE_KEY } from './document.state';

const root = createSubSelector(kbRoot, STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, isEmpty } =
  createDesignerCRUDSelectors(root);

export const { allByFolderID, allByFolderIDs, countByFolderID } = createByFolderIDSelectors(all);

export const count = createSelector(root, (state) => state.count);

export const fetchStatus = createSelector(root, (state) => state.fetchStatus);

export const isLoaded = createSelector(fetchStatus, (status) => status !== 'loading' && status !== 'idle');

export const processingIDs = createSelector(root, (state) => state.processingIDs);

export const getOneByName = createSelector(
  all,
  (documents) => (name: string) => documents.find((d) => d.data?.name === name)
);
