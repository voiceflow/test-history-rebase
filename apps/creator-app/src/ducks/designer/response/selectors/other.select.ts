import { createSelector } from 'reselect';

import { createByFolderIDSelectors } from '../../utils';
import { all, oneByID } from './crud.select';

export const { allByFolderID, countByFolderID } = createByFolderIDSelectors(all);

export const oneWithRelationsByID = createSelector(
  oneByID,
  (response) =>
    response && {
      ...response,
      discriminators: [],
    }
);
