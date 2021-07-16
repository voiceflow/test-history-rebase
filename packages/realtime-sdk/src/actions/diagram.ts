import { AWARENESS_KEY, DIAGRAM_KEY } from '../constants';
import { Coords, DiagramPayload } from '../types';
import { createAction, typeFactory } from './utils';

const diagramType = typeFactory(DIAGRAM_KEY);
const diagramAwarenessType = typeFactory(DIAGRAM_KEY, AWARENESS_KEY);

export const moveCursor = createAction<DiagramPayload<{ creatorID: number; coords: Coords }>>(diagramAwarenessType('MOVE_CURSOR'));
export const hideCursor = createAction<DiagramPayload<{ creatorID: number }>>(diagramAwarenessType('HIDE_CURSOR'));

export const addBlocks = createAction<DiagramPayload<{ blocks: Record<string, unknown> }>>(diagramType('ADD_BLOCKS'));
export const removeBlocks = createAction<DiagramPayload<{ blocks: Record<string, unknown> }>>(diagramType('REMOVE_BLOCKS'));
export const moveBlocks = createAction<DiagramPayload<{ blocks: Record<string, Coords> }>>(diagramType('MOVE_BLOCKS'));
export const dragBlocks = createAction<DiagramPayload<{ blocks: Record<string, Coords> }>>(diagramType('DRAG_BLOCKS'));
