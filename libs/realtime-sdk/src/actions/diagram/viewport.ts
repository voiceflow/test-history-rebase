import { Utils } from '@voiceflow/common';

import { createCRUDActions } from '@/actions/utils';
import { VIEWPORT_KEY } from '@/constants';
import type { ViewportModel } from '@/models';

import { diagramType } from './utils';

const diagramViewportType = Utils.protocol.typeFactory(diagramType(VIEWPORT_KEY));

export interface RehydrateViewportPayload {
  viewport: ViewportModel;
}

export const rehydrate = Utils.protocol.createAction<RehydrateViewportPayload>(diagramViewportType('REHYDRATE'));

export const { update } = createCRUDActions<ViewportModel>(diagramViewportType);
