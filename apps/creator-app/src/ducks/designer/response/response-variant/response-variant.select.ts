import { createSubSelector } from '@/ducks/utils/selector';

import { createDesignerCRUDSelectors } from '../../utils/selector.util';
import { root as responseRoot } from '../selectors/root.select';
import { STATE_KEY } from './response-variant.state';

const root = createSubSelector(responseRoot, STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } =
  createDesignerCRUDSelectors(root);
