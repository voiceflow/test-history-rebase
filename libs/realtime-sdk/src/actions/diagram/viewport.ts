import { createCRUDActions } from '@realtime-sdk/actions/utils';
import { VIEWPORT_KEY } from '@realtime-sdk/constants';
import type { ViewportModel } from '@realtime-sdk/models';
import { Utils } from '@voiceflow/common';

import { diagramType } from './utils';

const diagramViewportType = Utils.protocol.typeFactory(diagramType(VIEWPORT_KEY));

export interface RehydrateViewportPayload {
  viewport: ViewportModel;
}

export const rehydrate = Utils.protocol.createAction<RehydrateViewportPayload>(diagramViewportType('REHYDRATE'));

export const { update } = createCRUDActions<ViewportModel>(diagramViewportType);
