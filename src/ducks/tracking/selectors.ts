import { createRootSelector } from '@/ducks/utils';

import { STATE_KEY } from './constants';
import { State } from './types';

// eslint-disable-next-line import/prefer-default-export
export const rootSelector = createRootSelector<State>(STATE_KEY);
