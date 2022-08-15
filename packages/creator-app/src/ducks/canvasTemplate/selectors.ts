import { createCRUDSelectors } from '@/ducks/utils/crudV2';
import { createCurriedSelector } from '@/ducks/utils/selector';

import { STATE_KEY } from './constants';

export const {
  root: rootCanvasTemplatesSelector,
  map: mapCanvasTemplatesSelector,
  all: allCanvasTemplatesSelector,
  byID: canvasTemplatesByIDSelector,
} = createCRUDSelectors(STATE_KEY);

export const getCanvasTemplatesByIDSelector = createCurriedSelector(canvasTemplatesByIDSelector);
