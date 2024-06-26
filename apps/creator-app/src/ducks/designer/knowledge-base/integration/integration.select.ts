import { createSubSelector } from '@/ducks/utils';

import { createDesignerCRUDSelectors } from '../../utils/selector.util';
import { root as kbRoot } from '../knowledge-base.select';
import { STATE_KEY } from './integration.state';

const root = createSubSelector(kbRoot, STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } =
  createDesignerCRUDSelectors(root);
