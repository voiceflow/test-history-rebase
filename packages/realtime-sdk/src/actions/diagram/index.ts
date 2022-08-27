import { createAction, createAsyncAction, createCRUDActions, createType } from '@realtime-sdk/actions/utils';
import { COMPONENT_KEY, TEMPLATE_DIAGRAM_KEY, TOPIC_KEY, VARIABLES_KEY } from '@realtime-sdk/constants';
import { Diagram } from '@realtime-sdk/models';
import { BaseDiagramPayload, BaseVersionPayload } from '@realtime-sdk/types';
import { diagram } from '@realtime-sdk/utils';
import { Required } from 'utility-types';

import { diagramType } from './utils';

export * as awareness from './awareness';
export * as sharedNodes from './sharedNodes';
export * as viewport from './viewport';

const diagramTopicType = createType(diagramType(TOPIC_KEY));
const diagramComponentType = createType(diagramType(COMPONENT_KEY));
const diagramTemplateDiagramType = createType(diagramType(TEMPLATE_DIAGRAM_KEY));
const diagramVariablesType = createType(diagramType(VARIABLES_KEY));

// variables

export interface LocalVariablePayload extends BaseDiagramPayload {
  variable: string;
}

export interface ReorderMenuNodePayload extends BaseDiagramPayload {
  nodeID: string;
  toIndex: number;
}

export const reorderMenuNode = createAction<ReorderMenuNodePayload>(diagramTopicType('REORDER_MENU_NODE'));
export const addLocalVariable = createAction<LocalVariablePayload>(diagramVariablesType('ADD'));
export const removeLocalVariable = createAction<LocalVariablePayload>(diagramVariablesType('REMOVE'));

// crud

export interface CreateDiagramPayload extends BaseVersionPayload {
  diagram: Required<Partial<diagram.PrimitiveDiagram>, 'name'>;
}

export const createTopic = createAsyncAction<CreateDiagramPayload, Diagram>(diagramTopicType('CREATE'));
export const createComponent = createAsyncAction<CreateDiagramPayload, Diagram>(diagramComponentType('CREATE'));
export const createTemplateDiagram = createAsyncAction<CreateDiagramPayload, Diagram>(diagramTemplateDiagramType('CREATE'));
export const duplicate = createAsyncAction<BaseDiagramPayload, Diagram>(diagramType('DUPICATE'));
export const convertToTopic = createAsyncAction<BaseDiagramPayload, Diagram>(diagramType('CONVERT_TO_TOPIC'));

export const crud = createCRUDActions<Diagram, BaseVersionPayload>(diagramType);
