import { AWARENESS_KEY, DIAGRAM_KEY } from '../constants';
import { BaseDiagramPayload, Point } from '../types';
import { createAction, typeFactory } from './utils';

const diagramType = typeFactory(DIAGRAM_KEY);
const diagramAwarenessType = typeFactory(diagramType(AWARENESS_KEY));

// Awareness

export interface BaseCursorPayload extends BaseDiagramPayload {
  creatorID: number;
}

export interface AwarenessMoveCursor extends BaseCursorPayload {
  coords: Point;
}

export const awarenessHideCursor = createAction<BaseCursorPayload>(diagramAwarenessType('HIDE_CURSOR'));
export const awarenessMoveCursor = createAction<AwarenessMoveCursor>(diagramAwarenessType('MOVE_CURSOR'));

// Other

export interface AddRemoveBlocksPayload extends BaseDiagramPayload {
  blocks: { [blockID: string]: unknown };
}

export interface DragMoveBlocksPayload extends BaseDiagramPayload {
  blocks: { [blockID: string]: Point };
}

export const addBlocks = createAction<AddRemoveBlocksPayload>(diagramType('ADD_BLOCKS'));
export const removeBlocks = createAction<AddRemoveBlocksPayload>(diagramType('REMOVE_BLOCKS'));
export const moveBlocks = createAction<DragMoveBlocksPayload>(diagramType('MOVE_BLOCKS'));
export const dragBlocks = createAction<DragMoveBlocksPayload>(diagramType('DRAG_BLOCKS'));
