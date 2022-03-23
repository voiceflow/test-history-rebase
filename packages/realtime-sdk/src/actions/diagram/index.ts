import { createAction, createAsyncAction, createCRUDActions, createType } from '@realtime-sdk/actions/utils';
import { COMPONENT_KEY, TOPIC_KEY, VARIABLES_KEY } from '@realtime-sdk/constants';
import { Diagram } from '@realtime-sdk/models';
import { BaseDiagramPayload, BaseVersionPayload, Point } from '@realtime-sdk/types';
import { diagram } from '@realtime-sdk/utils';
import { Nullable } from '@voiceflow/base-types';
import { Required } from 'utility-types';

import { diagramType } from './utils';

export * as awareness from './awareness';
export * as viewport from './viewport';

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

export interface DiagramIntentStep {
  global: boolean;
  intentID: string;
}

export interface DiagramIntentStepMap {
  [nodeID: string]: Nullable<DiagramIntentStep>;
}

export interface LoadIntentStepsPayload extends BaseVersionPayload {
  intentSteps: { [diagramID: string]: DiagramIntentStepMap };
}

export interface ReloadIntentStepsPayload extends BaseDiagramPayload {
  intentSteps: DiagramIntentStepMap;
}

export interface UpdateIntentStepsPayload extends BaseDiagramPayload {
  stepID: string;
  intent: Nullable<DiagramIntentStep>;
}

export interface RegisterIntentStepsPayload extends BaseDiagramPayload {
  intentSteps: Array<{ stepID: string; intent: Nullable<DiagramIntentStep> }>;
}

export interface ReorderIntentStepsPayload extends BaseDiagramPayload {
  from: number;
  to: number;
}

export const loadIntentSteps = createAction<LoadIntentStepsPayload>(diagramIntentStepsType('LOAD'));
export const updateIntentSteps = createAction<UpdateIntentStepsPayload>(diagramIntentStepsType('UPDATE'));
export const reloadIntentSteps = createAction<ReloadIntentStepsPayload>(diagramIntentStepsType('RELOAD'));
export const reorderIntentSteps = createAction<ReorderIntentStepsPayload>(diagramIntentStepsType('REORDER'));
export const registerIntentSteps = createAction<RegisterIntentStepsPayload>(diagramIntentStepsType('REGISTER'));

// blocks

export interface DragMoveBlocksPayload extends BaseDiagramPayload {
  blocks: { [blockID: string]: Point };
}

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

export const crud = createCRUDActions<Diagram, BaseVersionPayload>(diagramType);
