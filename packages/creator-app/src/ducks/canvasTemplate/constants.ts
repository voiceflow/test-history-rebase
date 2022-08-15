import { createCRUDState } from '@/ducks/utils/crudV2';

import { CanvasTemplateState } from './types';

export const STATE_KEY = 'canvasTemplate';

export const INITIAL_STATE: CanvasTemplateState = createCRUDState();
