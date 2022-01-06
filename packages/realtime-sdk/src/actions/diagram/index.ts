import { createAction, createAsyncAction, createCRUDActions, createType } from '@realtime-sdk/actions/utils';
import { COMPONENT_KEY, TOPIC_KEY, VARIABLES_KEY } from '@realtime-sdk/constants';
import { Diagram } from '@realtime-sdk/models';
import { BaseDiagramPayload, BaseVersionPayload, Point } from '@realtime-sdk/types';
import { diagram } from '@realtime-sdk/utils';
import { Required } from 'utility-types';

import { diagramType } from './utils';

export * as awareness from './awareness';

const diagramTopicType = createType(diagramType(TOPIC_KEY));
const diagramComponentType = createType(diagramType(COMPONENT_KEY));
const diagramVariablesType = createType(diagramType(VARIABLES_KEY));
const diagramIntentStepsType = createType(diagramType('intent_steps'));

// variables

export interface LocalVariablePayload extends BaseDiagramPayload {
  variable: string;
}

export const addLocalVariable = createAction<LocalVariablePayload>(diagramVariablesType('ADD'));
export const removeLocalVariable = createAction<LocalVariablePayload>(diagramVariablesType('REMOVE'));

// intent steps

export interface LoadIntentStepsPayload extends BaseVersionPayload {
  intentSteps: { [diagramID: string]: { [nodeID: string]: string | null } };
}

export interface ReloadIntentStepsPayload extends BaseVersionPayload {
  diagramID: string;
  intentSteps: { [nodeID: string]: string | null };
}

export interface UpdateIntentStepsPayload extends BaseDiagramPayload {
  stepID: string;
  intentID: string | null;
}

export interface RegisterIntentStepsPayload extends BaseDiagramPayload {
  intentSteps: { stepID: string; intentID: string | null }[];
}

export interface ReorderIntentStepsPayload extends BaseDiagramPayload {
  from: number;
  to: number;
}

export const loadIntentSteps = createAction<LoadIntentStepsPayload>(diagramIntentStepsType('LOAD'));
export const updateIntentSteps = createAction<UpdateIntentStepsPayload>(diagramIntentStepsType('UPDATE'));
export const registerIntentSteps = createAction<RegisterIntentStepsPayload>(diagramIntentStepsType('REGISTER'));
export const reorderIntentSteps = createAction<ReorderIntentStepsPayload>(diagramIntentStepsType('REORDER'));
export const reloadIntentSteps = createAction<ReloadIntentStepsPayload>(diagramIntentStepsType('RELOAD'));

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
  diagram: Required<Partial<diagram.PrimitiveDiagram>, 'name'>;
}

export const createTopic = createAsyncAction<CreateDiagramPayload, Diagram>(diagramTopicType('CREATE'));
export const createComponent = createAsyncAction<CreateDiagramPayload, Diagram>(diagramComponentType('CREATE'));
export const duplicate = createAsyncAction<BaseDiagramPayload, Diagram>(diagramType('DUPICATE'));
export const convertToTopic = createAsyncAction<BaseDiagramPayload, Diagram>(diagramType('CONVERT_TO_TOPIC'));

export const crud = createCRUDActions<BaseVersionPayload, Diagram>(diagramType);
