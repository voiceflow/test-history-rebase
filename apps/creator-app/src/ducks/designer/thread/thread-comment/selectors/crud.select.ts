import { createDesignerCRUDSelectors } from '../../../utils';
import { root } from './root.select';

export const { all, map, keys, count, isEmpty, allByIDs, hasOneByID, oneByID, getOneByID, hasAllByIDs, getAllByIDs } =
  createDesignerCRUDSelectors(root);
