import { createRootSelector } from '@/ducks/utils';

import { STATE_KEY } from './constants';

// eslint-disable-next-line import/prefer-default-export
export const rootSelector = createRootSelector(STATE_KEY);
