import { createRootSelector } from '@/ducks/utils/selector';

import { STATE_KEY } from '../designer.state';

export const designerRootSelector = createRootSelector(STATE_KEY);
