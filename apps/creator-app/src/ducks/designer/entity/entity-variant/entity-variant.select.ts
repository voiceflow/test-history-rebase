import { createSelector } from 'reselect';

import { createCurriedSelector, createSubSelector } from '@/ducks/utils/selector';
import { sortCreatableCMSResources } from '@/utils/cms.util';

import { createDesignerCRUDSelectors, entityIDParamSelector } from '../../utils/selector.util';
import { root as entityRoot } from '../selectors/root.select';
import { STATE_KEY } from './entity-variant.state';

const root = createSubSelector(entityRoot, STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } =
  createDesignerCRUDSelectors(root);

export const allByEntityID = createSelector(all, entityIDParamSelector, (variants, entityID) =>
  !entityID ? [] : sortCreatableCMSResources(variants.filter((variant) => variant.entityID === entityID))
);

export const getAllByEntityID = createCurriedSelector(allByEntityID);
