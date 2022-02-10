import { BLOCK_KEY, NODE_KEY, PORT_KEY, STEP_KEY } from '@realtime-sdk/constants';
import { BuiltInPortRecord, Markup, NodeDataDescriptor, NodePortSchema, PartialModel, Port, PortsDescriptor } from '@realtime-sdk/models';
import { BaseBlockPayload, BaseDiagramPayload, BaseNodePayload, Point } from '@realtime-sdk/types';
import { BaseModels } from '@voiceflow/base-types';
import { Nullish, Utils } from '@voiceflow/common';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

const nodeType = Utils.protocol.typeFactory(NODE_KEY);
const nodeMarkupType = Utils.protocol.typeFactory(nodeType('markup'));
const nodeBlockType = Utils.protocol.typeFactory(nodeType(BLOCK_KEY));
const nodeStepType = Utils.protocol.typeFactory(nodeType(STEP_KEY));
const nodePortType = Utils.protocol.typeFactory(nodeType(PORT_KEY));

export interface UpdateDataPayload extends BaseNodePayload {
  data: unknown;
}

export interface RemoveManyNodesPayload extends BaseDiagramPayload {
  nodeIDs: string[];
}

export interface TranslateNodesPayload extends BaseDiagramPayload {
  blocks: { [blockID: string]: Point };
}

export const dragMany = Utils.protocol.createAction<TranslateNodesPayload>(nodeBlockType('DRAG_MANY'));
export const moveMany = Utils.protocol.createAction<TranslateNodesPayload>(nodeType('MOVE_MANY'));
export const updateData = Utils.protocol.createAction<UpdateDataPayload>(nodeType('UPDATE_DATA'));
export const removeMany = Utils.protocol.createAction<RemoveManyNodesPayload>(nodeType('REMOVE_MANY'));

// ports

export interface PortPayload extends BaseNodePayload {
  portID: string;
}

export interface AddDynamicPortPayload extends PortPayload {
  label: Nullish<string>;
}

export interface ReorderDynamicPortsPayload extends PortPayload {
  index: number;
}

export interface AddBuiltinPortPayload extends PortPayload {
  type: BaseModels.PortType;
  platform: Nullish<VoiceflowConstants.PlatformType>;
}

export const addDynamicPort = Utils.protocol.createAction<AddDynamicPortPayload>(nodePortType('ADD_DYNAMIC'));
export const addBuiltinPort = Utils.protocol.createAction<AddBuiltinPortPayload>(nodePortType('ADD_BUILTIN'));
export const reorderDynamicPorts = Utils.protocol.createAction<ReorderDynamicPortsPayload>(nodePortType('REORDER_DYNAMIC'));
export const removePort = Utils.protocol.createAction<PortPayload>(nodePortType('REMOVE'));

// markup

export interface AddMarkupPayload extends BaseNodePayload {
  data: NodeDataDescriptor<Markup.AnyNodeData>;
  origin: Point;
}

export const addMarkup = Utils.protocol.createAction<AddMarkupPayload>(nodeMarkupType('ADD'));

// blocks

export interface AddBlockPayload<T = unknown, O extends PortRecord = PortRecord> extends BaseBlockPayload {
  blockPorts: PortsDescriptor;
  blockOrigin: Point;
  stepID: string;
  stepData: NodeDataDescriptor<T>;
  stepPorts: NodePortSchema<PartialModel<Port>, O>;
}

export interface AddNodePayload<T = unknown, O extends PortRecord = PortRecord> extends BaseBlockPayload {
  stepID: string;
  data: NodeDataDescriptor<T>;
  ports: NodePortSchema<PartialModel<Port>, O>;
}

export const addBlock = Utils.protocol.createAction<AddBlockPayload>(nodeBlockType('ADD'));

// steps

type PortRecord = BuiltInPortRecord<PartialModel<Port>>;

export interface InsertStepPayload<T = unknown, O extends PortRecord = PortRecord> extends AddNodePayload<T, O> {
  index: number;
}

export interface IsolateStepPayload extends BaseBlockPayload {
  blockPorts: PortsDescriptor;
  blockOrigin: Point;
  stepID: string;
}

export const appendStep = Utils.protocol.createAction<AddNodePayload>(nodeStepType('APPEND'));
export const insertStep = Utils.protocol.createAction<InsertStepPayload>(nodeStepType('INSERT'));
export const isolateStep = Utils.protocol.createAction<IsolateStepPayload>(nodeStepType('ISOLATE'));
