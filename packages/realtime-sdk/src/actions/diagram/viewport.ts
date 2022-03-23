import { createAction, createCRUDActions, createType } from '@realtime-sdk/actions/utils';
import { VIEWPORT_KEY } from '@realtime-sdk/constants';
import { ViewportModel } from '@realtime-sdk/models';

import { diagramType } from './utils';

const diagramViewportType = createType(diagramType(VIEWPORT_KEY));

export interface RehydrateViewportPayload {
  viewport: ViewportModel;
}

export const rehydrate = createAction<RehydrateViewportPayload>(diagramViewportType('REHYDRATE'));

export const crud = createCRUDActions<ViewportModel>(diagramViewportType);
