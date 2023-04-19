import { ACTIONS_KEY, BLOCK_KEY, BlockType, NODE_KEY, STEP_KEY } from '@realtime-sdk/constants';
import { Markup, NodeData, NodeDataDescriptor, PortsDescriptor } from '@realtime-sdk/models';
import {
  BaseActionsPayload,
  BaseBlockPayload,
  BaseDiagramPayload,
  BaseNodePayload,
  BaseParentNodePayload,
  NodePortRemapsPayload,
  Point,
  ProjectMetaPayload,
  RemoveNode,
  SchemaVersionPayload,
} from '@realtime-sdk/types';
import { AnyRecord, Utils } from '@voiceflow/common';

const nodeType = Utils.protocol.typeFactory(NODE_KEY);
const nodeMarkupType = Utils.protocol.typeFactory(nodeType('markup'));
const nodeBlockType = Utils.protocol.typeFactory(nodeType(BLOCK_KEY));
const nodeActionsType = Utils.protocol.typeFactory(nodeType(ACTIONS_KEY));
const nodeStepType = Utils.protocol.typeFactory(nodeType(STEP_KEY));

export interface UpdateManyDataPayload<D extends AnyRecord = AnyRecord> extends BaseDiagramPayload, ProjectMetaPayload {
  nodes: NodeData<D>[];
}

export interface RemoveManyPayload extends BaseDiagramPayload {
  nodes: RemoveNode[];
}

export interface TranslatePayload extends BaseDiagramPayload {
  blocks: { [blockID: string]: Point };
}

export const moveMany = Utils.protocol.createAction<TranslatePayload>(nodeType('MOVE_MANY'));
export const updateDataMany = Utils.protocol.createAction<UpdateManyDataPayload>(nodeType('UPDATE_DATA_MANY'));
export const removeMany = Utils.protocol.createAction<RemoveManyPayload>(nodeType('REMOVE_MANY'));

// markup

export interface AddMarkupPayload extends BaseNodePayload, ProjectMetaPayload, SchemaVersionPayload {
  data: NodeDataDescriptor<Markup.AnyNodeData>;
  coords: Point;
}

export const addMarkup = Utils.protocol.createAction<AddMarkupPayload>(nodeMarkupType('ADD'));

// blocks

export interface AddBlockPayload<T = unknown> extends BaseBlockPayload, ProjectMetaPayload, SchemaVersionPayload {
  stepID: string;
  stepData: NodeDataDescriptor<T>;
  stepPorts: PortsDescriptor;
  blockName: string;
  blockPorts: PortsDescriptor;
  blockCoords: Point;
  blockColor?: string;
}

export interface AddActionsPayload<T = unknown> extends BaseActionsPayload, ProjectMetaPayload, SchemaVersionPayload {
  stepID: string;
  stepData: NodeDataDescriptor<T>;
  stepPorts: PortsDescriptor;
  actionsPorts: PortsDescriptor;
  actionsCoords: Point;
}

export const addBlock = Utils.protocol.createAction<AddBlockPayload>(nodeBlockType('ADD'));
export const addActions = Utils.protocol.createAction<AddActionsPayload>(nodeActionsType('ADD'));

// steps

export interface InsertStepPayload<T = unknown> extends BaseParentNodePayload, ProjectMetaPayload, SchemaVersionPayload, NodePortRemapsPayload {
  data: NodeDataDescriptor<T>;
  ports: PortsDescriptor;
  index: number;
  stepID: string;
  isActions: boolean;
  removeNodes: RemoveNode[];
}

export interface InsertManyStepsPayload<T = unknown> extends BaseParentNodePayload, ProjectMetaPayload, SchemaVersionPayload, NodePortRemapsPayload {
  steps: { data: NodeDataDescriptor<T>; ports: PortsDescriptor; stepID: string }[];
  index: number;
  removeNodes: RemoveNode[];
}

export interface ReorderStepsPayload extends BaseParentNodePayload, NodePortRemapsPayload {
  index: number;
  stepID: string;
  removeNodes: RemoveNode[];
}

export interface TransplantStepsPayload extends BaseDiagramPayload, NodePortRemapsPayload {
  index: number;
  stepIDs: string[];
  removeNodes: RemoveNode[];
  removeSource: boolean;
  sourceParentNodeID: string;
  targetParentNodeID: string;
}

export interface IsolateStepsPayload extends BaseParentNodePayload, ProjectMetaPayload, SchemaVersionPayload {
  stepIDs: string[];
  parentNodeData: { name: string; type: BlockType.COMBINED | BlockType.ACTIONS; ports: PortsDescriptor; coords: Point };
  sourceParentNodeID: string;
}

export const insertStep = Utils.protocol.createAction<InsertStepPayload>(nodeStepType('INSERT'));
export const insertManySteps = Utils.protocol.createAction<InsertManyStepsPayload>(nodeStepType('INSERT_MANY'));
export const reorderSteps = Utils.protocol.createAction<ReorderStepsPayload>(nodeStepType('REORDER'));
export const isolateSteps = Utils.protocol.createAction<IsolateStepsPayload>(nodeStepType('ISOLATE'));
export const transplantSteps = Utils.protocol.createAction<TransplantStepsPayload>(nodeStepType('TRANSPLANT'));
