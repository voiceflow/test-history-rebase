import { createReducerFactory } from '@/ducks/utils';

import { CanvasTemplateState } from '../types';

export const createReducer = createReducerFactory<CanvasTemplateState>();
