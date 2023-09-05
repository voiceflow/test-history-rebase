import { createSelector } from 'reselect';

import { activeFlowIDSelector } from '@/ducks/session/selectors';

import { getOneByID } from '../../selectors/crud.select';

export const root = createSelector(activeFlowIDSelector, getOneByID, (flowID, getByID) => getByID({ id: flowID }));

export const name = createSelector(root, (flow) => flow?.name ?? '');
