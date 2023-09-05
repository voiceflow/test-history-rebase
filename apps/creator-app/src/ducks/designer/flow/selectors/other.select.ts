import { createSelector } from 'reselect';

import { createByFolderIDSelectors } from '../../utils';
import { all, oneByID } from './crud.select';

export const { allByFolderID, countByFolderID } = createByFolderIDSelectors(all);

export const nameByID = createSelector(oneByID, (flow) => flow?.name ?? null);
