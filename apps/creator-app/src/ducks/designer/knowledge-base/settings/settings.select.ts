import { createSubSelector } from '@/ducks/utils';

import { root as kbRoot } from '../knowledge-base.select';
import { STATE_KEY } from './settings.state';

export const root = createSubSelector(kbRoot, STATE_KEY);
