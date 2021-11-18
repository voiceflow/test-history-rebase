import { updateViewportForDiagram } from '@/ducks/viewport';
import { Thunk } from '@/store/types';
import { Viewport } from '@/types';

import * as Factories from './factories';
import diagramReducer from './reducers';
import { creatorDiagramIDSelector } from './selectors';

export { Factories };

export * from './actions';
export * from './constants';
export * from './selectors';
export * from './sideEffects';
export * from './types';
export * as diagramUtils from './utils';

export default diagramReducer;

// side effects

export const updateViewport =
  (viewport: Viewport): Thunk =>
  async (dispatch, getState) => {
    const diagramID = creatorDiagramIDSelector(getState())!;

    dispatch(updateViewportForDiagram(diagramID, viewport));
  };
