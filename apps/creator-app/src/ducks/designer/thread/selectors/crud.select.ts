import { createDesignerCRUDSelectors } from '../../utils/selector.util';
import { root } from './root.select';

const crud = createDesignerCRUDSelectors(root);

export const { map, keys, count, isEmpty, allByIDs, hasOneByID, oneByID, hasAllByIDs, getAllByIDs, all, getOneByID } =
  crud;
