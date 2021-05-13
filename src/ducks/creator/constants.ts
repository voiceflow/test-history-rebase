import { duckLogger } from '@/ducks/utils';

export const STATE_KEY = 'creator';

export const log = duckLogger.child(STATE_KEY);
