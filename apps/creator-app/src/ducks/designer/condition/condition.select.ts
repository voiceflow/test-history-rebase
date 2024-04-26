import { createDesignerCRUDSelectors, createDesignerSelector } from '../utils/selector.util';
import { STATE_KEY } from './condition.state';

export const root = createDesignerSelector(STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } =
  createDesignerCRUDSelectors(root);
