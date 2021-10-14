import { COMPONENT_KEY, TOPIC_KEY, VARIABLES_KEY } from '../../constants';
import { Diagram } from '../../models';
import { BaseDiagramPayload, BaseVersionPayload, Point } from '../../types';
import { createAction, createCRUDActions, typeFactory } from '../utils';
import { diagramType } from './utils';

export * as awareness from './awareness';

const diagramTopicType = typeFactory(diagramType(TOPIC_KEY));
const diagramComponentType = typeFactory(diagramType(COMPONENT_KEY));
const diagramVariablesType = typeFactory(diagramType(VARIABLES_KEY));

// variables

export interface LocalVariablePayload extends BaseDiagramPayload {
  variable: string;
}

export const addLocalVariable = createAction<LocalVariablePayload>(diagramVariablesType('ADD'));

export const removeLocalVariable = createAction<LocalVariablePayload>(diagramVariablesType('REMOVE'));

// nodes

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

// crud

export interface CreateDiagramPayload extends BaseVersionPayload {
  name: string;
}

export const createTopic = createAction.async<CreateDiagramPayload, Diagram>(diagramTopicType('CREATE'));
export const createComponent = createAction.async<CreateDiagramPayload, Diagram>(diagramComponentType('CREATE'));
export const duplicate = createAction.async<BaseDiagramPayload, Diagram>(diagramType('DUPICATE'));

export const crud = createCRUDActions<BaseVersionPayload, Diagram>(diagramType);
