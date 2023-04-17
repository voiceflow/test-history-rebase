import { BlockType } from '@realtime-sdk/constants';
import { BaseVersionPayload } from '@realtime-sdk/types';
import { Nullable, Utils } from '@voiceflow/common';

import { diagramType } from './utils';

const menuNodesType = Utils.protocol.typeFactory(diagramType('shared_nodes'));

export interface BaseSharedNode {
  type: BlockType;
  nodeID: string;
}

export interface StartNode extends BaseSharedNode {
  type: BlockType.START;
  name: string;
}

export interface IntentNode extends BaseSharedNode {
  type: BlockType.INTENT;
  global: boolean;
  intentID: string | null;
}

export interface CombinedNode extends BaseSharedNode {
  type: BlockType.COMBINED;
  name: string;
}

export interface ComponentNode extends BaseSharedNode {
  type: BlockType.COMPONENT;
  componentID: string | null;
}

export type SharedNode = StartNode | IntentNode | CombinedNode | ComponentNode;

export interface SharedNodeMap {
  [nodeID: string]: Nullable<SharedNode>;
}

export interface DiagramSharedNodeMap {
  [diagramID: string]: SharedNodeMap;
}

export interface LoadPayload extends BaseVersionPayload {
  sharedNodes: DiagramSharedNodeMap;
}

export interface ReloadPayload extends BaseVersionPayload {
  sharedNodes: DiagramSharedNodeMap;
}

export const load = Utils.protocol.createAction<LoadPayload>(menuNodesType('LOAD'));
export const reload = Utils.protocol.createAction<ReloadPayload>(menuNodesType('RELOAD'));
