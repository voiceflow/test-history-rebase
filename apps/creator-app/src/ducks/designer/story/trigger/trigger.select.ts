import { createSubSelector } from '@/ducks/utils/selector';

import { createDesignerCRUDSelectors } from '../../utils/selector.util';
import * as StorySelect from '../story.select';
import { STATE_KEY } from './trigger.state';

const root = createSubSelector(StorySelect.root, STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } = createDesignerCRUDSelectors(root);
