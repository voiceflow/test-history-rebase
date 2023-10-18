import { createDesignerCRUDSelectors } from '../../utils';
import { root } from './root.select';

export const { all, map, keys, count, isEmpty, oneByID, allByIDs, hasOneByID, getOneByID, hasAllByIDs, getAllByIDs } =
  createDesignerCRUDSelectors(root);
