import { AWARENESS_KEY, DIAGRAM_KEY } from '../constants';
import { Coords } from '../types';
import { createAction, typeFactory } from './utils';

const diagramType = typeFactory(DIAGRAM_KEY);
const diagramAwarenessType = typeFactory(DIAGRAM_KEY, AWARENESS_KEY);

export const moveCursor = createAction<{ tabID: string; coords: Coords }>(diagramAwarenessType('MOVE_CURSOR'));
export const hideCursor = createAction<{ tabID: string }>(diagramAwarenessType('HIDE_CURSOR'));

export const addBlocks = createAction<{ blocks: Record<string, unknown> }>(diagramType('ADD_BLOCKS'));
export const removeBlocks = createAction<{ blocks: Record<string, unknown> }>(diagramType('REMOVE_BLOCKS'));
export const moveBlocks = createAction<{ blocks: Record<string, Coords> }>(diagramType('MOVE_BLOCKS'));
export const dragBlocks = createAction<{ blocks: Record<string, Coords> }>(diagramType('DRAG_BLOCKS'));
