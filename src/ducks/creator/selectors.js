import { createRootSelector } from '@/ducks/utils';

import { STATE_KEY } from './constants';

export const creatorStateSelector = createRootSelector(STATE_KEY);
