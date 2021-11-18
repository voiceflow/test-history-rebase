import { AWARENESS_KEY } from '@realtime-sdk/constants';
import { BaseDiagramPayload, Point } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

import { diagramType } from './utils';

const diagramAwarenessType = Utils.protocol.typeFactory(diagramType(AWARENESS_KEY));

export interface BaseCursorPayload extends BaseDiagramPayload {
  creatorID: number;
}

export interface MoveCursor extends BaseCursorPayload {
  coords: Point;
}

export const hideCursor = Utils.protocol.createAction<BaseCursorPayload>(diagramAwarenessType('HIDE_CURSOR'));
export const moveCursor = Utils.protocol.createAction<MoveCursor>(diagramAwarenessType('MOVE_CURSOR'));
