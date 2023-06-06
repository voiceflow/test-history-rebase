import { createCRUDActions } from '@realtime-sdk/actions/utils';
import { COMPONENT_KEY, TEMPLATE_DIAGRAM_KEY, VARIABLES_KEY } from '@realtime-sdk/constants';
import { Diagram } from '@realtime-sdk/models';
import { BaseDiagramPayload, BaseVersionPayload } from '@realtime-sdk/types';
import { PrimitiveDiagram } from '@realtime-sdk/utils/diagram';
import { Utils } from '@voiceflow/common';
import { Required } from 'utility-types';

import { diagramType } from './utils';

export * as awareness from './awareness';
export * as sharedNodes from './sharedNodes';
export * as utils from './utils';
export * as viewport from './viewport';

const diagramComponentType = Utils.protocol.typeFactory(diagramType(COMPONENT_KEY));
const diagramVariablesType = Utils.protocol.typeFactory(diagramType(VARIABLES_KEY));
const diagramTemplateDiagramType = Utils.protocol.typeFactory(diagramType(TEMPLATE_DIAGRAM_KEY));

// crud
export const crud = createCRUDActions<Diagram, BaseVersionPayload, Pick<Diagram, 'name'>>(diagramType);

// components
export interface ComponentCreatePayload extends BaseVersionPayload {
  component: Required<Partial<PrimitiveDiagram>, 'name'>;
}

export const componentRemove = Utils.protocol.createAction<BaseDiagramPayload>(diagramComponentType('REMOVE'));
export const componentCreate = Utils.protocol.createAsyncAction<ComponentCreatePayload, Diagram>(diagramComponentType('CREATE'));
export const componentDuplicate = Utils.protocol.createAsyncAction<BaseDiagramPayload, Diagram>(diagramComponentType('DUPLICATE'));

// variables
export interface LocalVariablePayload extends BaseDiagramPayload {
  variable: string;
}

export const addLocalVariable = Utils.protocol.createAction<LocalVariablePayload>(diagramVariablesType('ADD'));
export const removeLocalVariable = Utils.protocol.createAction<LocalVariablePayload>(diagramVariablesType('REMOVE'));

// template diagram
export interface TemplateCreatePayload extends BaseVersionPayload {
  template: Required<Partial<PrimitiveDiagram>, 'name'>;
}

export const templateCreate = Utils.protocol.createAsyncAction<TemplateCreatePayload, Diagram>(diagramTemplateDiagramType('CREATE'));
