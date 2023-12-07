import { createSubSelector } from '@/ducks/utils/selector';

import { createDesignerCRUDSelectors } from '../../utils/selector.util';
import * as ConditionSelect from '../condition.select';
import { STATE_KEY } from './condition-assertion.state';

const root = createSubSelector(ConditionSelect.root, STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } = createDesignerCRUDSelectors(root);
