import { createCRUDActions } from '@realtime-sdk/actions/utils';
import { COMPONENT_KEY, MENU_ITEM_KEY, SUBTOPIC_KEY, TEMPLATE_DIAGRAM_KEY, VARIABLES_KEY } from '@realtime-sdk/constants';
import { Diagram } from '@realtime-sdk/models';
import { BaseDiagramPayload, BaseDomainPayload, BaseVersionPayload } from '@realtime-sdk/types';
import { PrimitiveDiagram } from '@realtime-sdk/utils/diagram';
import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Required } from 'utility-types';

import { diagramType } from './utils';

export * as awareness from './awareness';
export * as sharedNodes from './sharedNodes';
export * as utils from './utils';
export * as viewport from './viewport';

const diagramMenuItemType = Utils.protocol.typeFactory(diagramType(MENU_ITEM_KEY));
const diagramSubtopicType = Utils.protocol.typeFactory(diagramType(SUBTOPIC_KEY));
const diagramComponentType = Utils.protocol.typeFactory(diagramType(COMPONENT_KEY));
const diagramVariablesType = Utils.protocol.typeFactory(diagramType(VARIABLES_KEY));
const diagramTemplateDiagramType = Utils.protocol.typeFactory(diagramType(TEMPLATE_DIAGRAM_KEY));

// crud
export const crud = createCRUDActions<Diagram, BaseVersionPayload, Pick<Diagram, 'name'>>(diagramType);

// components
export interface ComponentCreatePayload extends BaseVersionPayload {
  component: Required<Partial<PrimitiveDiagram>, 'name'>;
}

export interface ComponentDuplicatePayload extends BaseVersionPayload {
  // TODO: remove in a few weeks after component duplication is fully rolled out
  diagramID?: string;
  sourceVersionID: string;
  sourceComponentID: string;
}

export const componentRemove = Utils.protocol.createAction<BaseDiagramPayload>(diagramComponentType('REMOVE'));
export const componentCreate = Utils.protocol.createAsyncAction<ComponentCreatePayload, Diagram>(diagramComponentType('CREATE'));
export const componentDuplicate = Utils.protocol.createAsyncAction<ComponentDuplicatePayload, Diagram>(diagramComponentType('DUPLICATE'));

// subtopics

export interface BaseSubtopicPayload extends BaseDomainPayload {
  rootTopicID: string;
}

export interface SubtopicCreatePayload extends BaseSubtopicPayload {
  subtopic: Required<Partial<PrimitiveDiagram>, 'name'>;
}

export interface SubtopicAddPayload extends BaseSubtopicPayload {
  subtopicID: string;
}

export interface SubtopicRemovePayload extends BaseSubtopicPayload {
  subtopicID: string;
}

export interface SubtopicMovePayload extends BaseSubtopicPayload {
  subtopicID: string;
  toTopicID: string;
}

export const subtopicCreate = Utils.protocol.createAsyncAction<SubtopicCreatePayload, Diagram>(diagramSubtopicType('CREATE'));
export const subtopicRemove = Utils.protocol.createAction<SubtopicRemovePayload>(diagramSubtopicType('REMOVE'));
export const subtopicMove = Utils.protocol.createAction<SubtopicMovePayload>(diagramSubtopicType('MOVE'));

// variables
export interface LocalVariablePayload extends BaseDiagramPayload {
  variable: string;
}

export const addLocalVariable = Utils.protocol.createAction<LocalVariablePayload>(diagramVariablesType('ADD'));
export const removeLocalVariable = Utils.protocol.createAction<LocalVariablePayload>(diagramVariablesType('REMOVE'));

// menu items

export interface BaseMenuItemPayload extends BaseDiagramPayload {
  sourceID: string;
}

export interface AddMenuItemPayload extends BaseMenuItemPayload {
  type: BaseModels.Diagram.MenuItemType;
}

export interface ReorderMenuItemPayload extends BaseMenuItemPayload {
  toIndex: number;
}
export interface MoveMenuItemPayload extends BaseMenuItemPayload {
  type: BaseModels.Diagram.MenuItemType;
  toIndex: number;
  toDiagramID: string;
}

export const addMenuItem = Utils.protocol.createAction<AddMenuItemPayload>(diagramMenuItemType('ADD'));
export const removeMenuItem = Utils.protocol.createAction<BaseMenuItemPayload>(diagramMenuItemType('REMOVE'));
export const reorderMenuItem = Utils.protocol.createAction<ReorderMenuItemPayload>(diagramMenuItemType('REORDER'));

// template diagram
export interface TemplateCreatePayload extends BaseVersionPayload {
  template: Required<Partial<PrimitiveDiagram>, 'name'>;
}

export const templateCreate = Utils.protocol.createAsyncAction<TemplateCreatePayload, Diagram>(diagramTemplateDiagramType('CREATE'));
