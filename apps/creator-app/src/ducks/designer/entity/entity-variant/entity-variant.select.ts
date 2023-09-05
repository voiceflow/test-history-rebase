import { createSelector } from 'reselect';

import { createSubSelector } from '@/ducks/utils/selector';

import { createDesignerCRUDSelectors, entityIDParamSelector } from '../../utils';
import * as EntitySelect from '../entity.select';
import { STATE_KEY } from './entity-variant.state';

const root = createSubSelector(EntitySelect.root, STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } = createDesignerCRUDSelectors(root);

export const allByEntityID = createSelector(all, entityIDParamSelector, (variants, entityID) =>
  !entityID
    ? []
    : variants.filter((variant) => variant.entityID === entityID).sort((l, r) => new Date(r.createdAt).getTime() - new Date(l.createdAt).getTime())
);
