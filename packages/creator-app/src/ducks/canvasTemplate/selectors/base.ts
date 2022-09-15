import { createSelector } from 'reselect';

import { createRootSelector } from '@/ducks/utils';

import { STATE_KEY } from '../constants';

export const creatorStateSelector = createRootSelector(STATE_KEY);

export const activeDiagramIDSelector = createSelector([creatorStateSelector], ({ activeDiagramID }) => activeDiagramID);
