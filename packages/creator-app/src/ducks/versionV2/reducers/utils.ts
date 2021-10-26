import { createReducerFactory } from '@/ducks/utils';

import { VersionState } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const createReducer = createReducerFactory<VersionState>();
