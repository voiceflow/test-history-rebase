import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from './constants';

export const {
  root: rootCanvasTemplatesSelector,
  map: mapCanvasTemplatesSelector,
  all: allCanvasTemplatesSelector,
  byID: canvasTemplatesByIDSelector,
  getByID: getCanvasTemplatesByIDSelector,
} = createCRUDSelectors(STATE_KEY);
