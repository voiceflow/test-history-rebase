import { Utils } from '@voiceflow/common';

import { AWARENESS_KEY } from '../../constants';
import { BaseDiagramPayload, Point } from '../../types';
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
