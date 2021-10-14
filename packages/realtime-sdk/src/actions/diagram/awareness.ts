import { AWARENESS_KEY } from '../../constants';
import { BaseDiagramPayload, Point } from '../../types';
import { createAction, typeFactory } from '../utils';
import { diagramType } from './utils';

const diagramAwarenessType = typeFactory(diagramType(AWARENESS_KEY));

export interface BaseCursorPayload extends BaseDiagramPayload {
  creatorID: number;
}

export interface MoveCursor extends BaseCursorPayload {
  coords: Point;
}

export const hideCursor = createAction<BaseCursorPayload>(diagramAwarenessType('HIDE_CURSOR'));
export const moveCursor = createAction<MoveCursor>(diagramAwarenessType('MOVE_CURSOR'));
