import { duckLogger } from '@/ducks/utils';

import { STATE_KEY } from './constants';

export const log = duckLogger.child(STATE_KEY);
