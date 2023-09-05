import { createDesignerCRUDSelectors } from '../../utils';
import { root } from './root.select';

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } = createDesignerCRUDSelectors(root);
