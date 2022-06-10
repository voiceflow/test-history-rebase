import { BLOCK_KEY, NODE_KEY, STEP_KEY } from '@realtime-sdk/constants';
import { Markup, NodeData, NodeDataDescriptor, PortsDescriptor } from '@realtime-sdk/models';
import { BaseBlockPayload, BaseDiagramPayload, BaseNodePayload, Point, ProjectMetaPayload, SchemaVersionPayload } from '@realtime-sdk/types';
import { AnyRecord, Nullish, Utils } from '@voiceflow/common';

const nodeType = Utils.protocol.typeFactory(NODE_KEY);
const nodeMarkupType = Utils.protocol.typeFactory(nodeType('markup'));
const nodeBlockType = Utils.protocol.typeFactory(nodeType(BLOCK_KEY));
const nodeStepType = Utils.protocol.typeFactory(nodeType(STEP_KEY));

export interface NodePortRemap {
  nodeID: string;
  ports: {
    key?: string;
    type?: string;
    portID: string;
  }[];
  targetNodeID: string | null;
}
export interface UpdateManyDataPayload<D extends AnyRecord = AnyRecord> extends BaseDiagramPayload, ProjectMetaPayload {
  nodes: NodeData<D>[];
}

export interface RemoveManyPayload extends BaseDiagramPayload {
  nodes: { blockID: string; stepID?: Nullish<string> }[];
  nodePortRemaps: NodePortRemap[];
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
  blockPorts: PortsDescriptor;
  blockCoords: Point;
  blockName: string;
  stepID: string;
  stepData: NodeDataDescriptor<T>;
  stepPorts: PortsDescriptor;
}

export const addBlock = Utils.protocol.createAction<AddBlockPayload>(nodeBlockType('ADD'));

// steps

export interface AppendStepPayload<T = unknown> extends BaseBlockPayload, ProjectMetaPayload, SchemaVersionPayload {
  stepID: string;
  data: NodeDataDescriptor<T>;
  ports: PortsDescriptor;
}

export interface InsertStepPayload<T = unknown> extends AppendStepPayload<T> {
  index: number;
  nodePortRemaps: NodePortRemap[];
}
export interface ReorderStepsPayload extends BaseBlockPayload {
  stepID: string;
  index: number;
  nodePortRemaps: NodePortRemap[];
}

export interface TransplantStepsPayload extends BaseDiagramPayload {
  sourceBlockID: string;
  targetBlockID: string;
  stepIDs: string[];
  index: number;
  removeSource?: boolean;
  nodePortRemaps: NodePortRemap[];
}

export interface IsolateStepPayload extends BaseBlockPayload, ProjectMetaPayload, SchemaVersionPayload {
  sourceBlockID: string;
  blockPorts: PortsDescriptor;
  blockCoords: Point;
  blockName: string;
  stepID: string;
  removeSource?: boolean;
  nodePortRemaps: NodePortRemap[];
}

export const appendStep = Utils.protocol.createAction<AppendStepPayload>(nodeStepType('APPEND'));
export const insertStep = Utils.protocol.createAction<InsertStepPayload>(nodeStepType('INSERT'));
export const reorderSteps = Utils.protocol.createAction<ReorderStepsPayload>(nodeStepType('REORDER'));
export const transplantSteps = Utils.protocol.createAction<TransplantStepsPayload>(nodeStepType('TRANSPLANT'));
export const isolateStep = Utils.protocol.createAction<IsolateStepPayload>(nodeStepType('ISOLATE'));
