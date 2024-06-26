import { createRootReducer } from '@/ducks/utils';

import { INITIAL_STATE } from '../constants';
import { rehydrateViewportReducer } from './rehydrate';
import { updateViewportReducer } from './update';

export const viewportReducer = createRootReducer(INITIAL_STATE)
  .immerCase(...updateViewportReducer)
  .immerCase(...rehydrateViewportReducer)
  .build();
