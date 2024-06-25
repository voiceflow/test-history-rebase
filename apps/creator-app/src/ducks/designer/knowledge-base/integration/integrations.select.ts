import { createSubSelector } from '@/ducks/utils';

import { createDesignerCRUDSelectors } from '../../utils/selector.util';
import { root as intentRoot } from '../selectors/root.select';
import { STATE_KEY } from './integration.state';

const root = createSubSelector(intentRoot, STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } =
  createDesignerCRUDSelectors(root);
