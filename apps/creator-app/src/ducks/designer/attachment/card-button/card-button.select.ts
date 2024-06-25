import { createSubSelector } from '@/ducks/utils/selector';

import { createDesignerCRUDSelectors } from '../../utils/selector.util';
import * as AttachmentSelect from '../attachment.select';
import { STATE_KEY } from './card-button.state';

const root = createSubSelector(AttachmentSelect.root, STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } =
  createDesignerCRUDSelectors(root);
