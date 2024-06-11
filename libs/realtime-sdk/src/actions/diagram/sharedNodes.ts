import { BlockType } from '@realtime-sdk/constants';
import { BaseVersionPayload } from '@realtime-sdk/types';
import { Nullable, Utils } from '@voiceflow/common';
import { TriggerNodeItem } from '@voiceflow/dtos';

import { diagramType } from './utils';

const menuNodesType = Utils.protocol.typeFactory(diagramType('shared_nodes'));

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
export interface BaseSharedNode {
  type: BlockType;
  nodeID: string;
}

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
export interface StartNode extends BaseSharedNode {
  type: BlockType.START;
  name: string;
  triggers: TriggerNodeItem[];
}

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
export interface IntentNode extends BaseSharedNode {
  type: BlockType.INTENT;
  global: boolean;
  intentID: string | null;
}

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
export interface CombinedNode extends BaseSharedNode {
  type: BlockType.COMBINED;
  name: string;
}

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
export interface TriggerNode extends BaseSharedNode {
  type: BlockType.TRIGGER;
  items: TriggerNodeItem[];
}

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
export interface ComponentNode extends BaseSharedNode {
  type: BlockType.COMPONENT;
  componentID: string | null;
}

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
export type SharedNode = StartNode | IntentNode | CombinedNode | ComponentNode | TriggerNode;

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
export interface SharedNodeMap {
  [nodeID: string]: Nullable<SharedNode>;
}

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
export interface DiagramSharedNodeMap {
  [diagramID: string]: SharedNodeMap;
}

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
export interface LoadPayload extends BaseVersionPayload {
  sharedNodes: DiagramSharedNodeMap;
}

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
export interface ReloadPayload extends BaseVersionPayload {
  sharedNodes: DiagramSharedNodeMap;
}

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
export const load = Utils.protocol.createAction<LoadPayload>(menuNodesType('LOAD'));
/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
export const reload = Utils.protocol.createAction<ReloadPayload>(menuNodesType('RELOAD'));
