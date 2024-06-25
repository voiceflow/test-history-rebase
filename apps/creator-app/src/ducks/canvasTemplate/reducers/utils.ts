import { createReducerFactory } from '@/ducks/utils';

import type { CanvasTemplateState } from '../types';

export const createReducer = createReducerFactory<CanvasTemplateState>();
