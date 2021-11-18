import { createCRUDActions } from '@realtime-sdk/actions/utils';
import { COMPONENT_KEY, TOPIC_KEY, VARIABLES_KEY } from '@realtime-sdk/constants';
import { Diagram } from '@realtime-sdk/models';
import { BaseDiagramPayload, BaseVersionPayload, Point } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';
import { Required } from 'utility-types';

import { diagram } from '../../utils';
import { diagramType } from './utils';

export * as awareness from './awareness';

const diagramTopicType = Utils.protocol.typeFactory(diagramType(TOPIC_KEY));
const diagramComponentType = Utils.protocol.typeFactory(diagramType(COMPONENT_KEY));
const diagramVariablesType = Utils.protocol.typeFactory(diagramType(VARIABLES_KEY));
const diagramIntentStepsType = Utils.protocol.typeFactory(diagramType('intent_steps'));

// variables

export interface LocalVariablePayload extends BaseDiagramPayload {
  variable: string;
}

export const addLocalVariable = Utils.protocol.createAction<LocalVariablePayload>(diagramVariablesType('ADD'));
export const removeLocalVariable = Utils.protocol.createAction<LocalVariablePayload>(diagramVariablesType('REMOVE'));

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

export const loadIntentSteps = Utils.protocol.createAction<LoadIntentStepsPayload>(diagramIntentStepsType('LOAD'));
export const updateIntentSteps = Utils.protocol.createAction<UpdateIntentStepsPayload>(diagramIntentStepsType('UPDATE'));
export const registerIntentSteps = Utils.protocol.createAction<RegisterIntentStepsPayload>(diagramIntentStepsType('REGISTER'));
export const reorderIntentSteps = Utils.protocol.createAction<ReorderIntentStepsPayload>(diagramIntentStepsType('REORDER'));
export const reloadIntentSteps = Utils.protocol.createAction<ReloadIntentStepsPayload>(diagramIntentStepsType('RELOAD'));

// nodes

export interface AddRemoveBlocksPayload extends BaseDiagramPayload {
  blocks: { [blockID: string]: unknown };
}

export interface DragMoveBlocksPayload extends BaseDiagramPayload {
  blocks: { [blockID: string]: Point };
}

export const addBlocks = Utils.protocol.createAction<AddRemoveBlocksPayload>(diagramType('ADD_BLOCKS'));
export const removeBlocks = Utils.protocol.createAction<AddRemoveBlocksPayload>(diagramType('REMOVE_BLOCKS'));
export const moveBlocks = Utils.protocol.createAction<DragMoveBlocksPayload>(diagramType('MOVE_BLOCKS'));
export const dragBlocks = Utils.protocol.createAction<DragMoveBlocksPayload>(diagramType('DRAG_BLOCKS'));

// crud

export interface CreateDiagramPayload extends BaseVersionPayload {
  diagram: Required<Partial<diagram.PrimitiveDiagram>, 'name'>;
}

export const createTopic = Utils.protocol.createAction.async<CreateDiagramPayload, Diagram>(diagramTopicType('CREATE'));
export const createComponent = Utils.protocol.createAction.async<CreateDiagramPayload, Diagram>(diagramComponentType('CREATE'));
export const duplicate = Utils.protocol.createAction.async<BaseDiagramPayload, Diagram>(diagramType('DUPICATE'));
export const convertToTopic = Utils.protocol.createAction<BaseDiagramPayload>(diagramType('CONVERT_TO_TOPIC'));

export const crud = createCRUDActions<BaseVersionPayload, Diagram>(diagramType);
