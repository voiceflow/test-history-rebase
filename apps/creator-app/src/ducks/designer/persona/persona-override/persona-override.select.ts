import { createSubSelector } from '@/ducks/utils/selector';

import { createDesignerCRUDSelectors } from '../../utils/selector.util';
import * as PersonaSelect from '../persona.select';
import { STATE_KEY } from './persona-override.state';

const root = createSubSelector(PersonaSelect.root, STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } = createDesignerCRUDSelectors(root);
