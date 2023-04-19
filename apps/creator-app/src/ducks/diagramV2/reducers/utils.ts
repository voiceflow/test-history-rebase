/* eslint-disable no-param-reassign */
import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Draft } from 'immer';
import * as Normal from 'normal-store';

import { createCombinedReducerFactory, createReducerFactory } from '@/ducks/utils';

import { DiagramState } from '../types';

export const createReducer = createReducerFactory<DiagramState>();
export const createCombinedReducer = createCombinedReducerFactory<DiagramState>();

export const removeDiagramSharedNodes = (state: Draft<DiagramState>, diagramID: string) => {
  delete state.sharedNodes[diagramID];
  delete state.globalIntentStepMap[diagramID];
};

export const addSharedNode = (state: Draft<DiagramState>, diagramID: string, sharedNode: Realtime.diagram.sharedNodes.SharedNode | null) => {
  if (!sharedNode) return;

  state.sharedNodes[diagramID][sharedNode.nodeID] = sharedNode;

  if (sharedNode.type !== Realtime.BlockType.INTENT || !sharedNode.intentID || !sharedNode.global) return;

  state.globalIntentStepMap[diagramID] ??= {};
  state.globalIntentStepMap[diagramID][sharedNode.intentID] ??= [];
  state.globalIntentStepMap[diagramID][sharedNode.intentID].push(sharedNode.nodeID);
};

export const addSharedNodeAndMenuItem = (
  state: Draft<DiagramState>,
  diagramID: string,
  sharedNode: Realtime.diagram.sharedNodes.SharedNode | null
) => {
  if (!sharedNode) return;

  const diagram = Normal.getOne(state, diagramID);

  if (diagram && Realtime.Utils.typeGuards.isDiagramMenuBlockType(sharedNode.type)) {
    diagram.menuItems = [...diagram.menuItems, { type: BaseModels.Diagram.MenuItemType.NODE, sourceID: sharedNode.nodeID }];
  }

  addSharedNode(state, diagramID, sharedNode);
};

export const addSharedNodes = (state: Draft<DiagramState>, sharedNodes: Realtime.diagram.sharedNodes.DiagramSharedNodeMap) => {
  Object.entries(sharedNodes).forEach(([diagramID, sharedNodeMap]) => {
    state.sharedNodes[diagramID] = {};
    state.globalIntentStepMap[diagramID] = {};

    Object.values(sharedNodeMap).forEach((sharedNode) => sharedNode && addSharedNode(state, diagramID, sharedNode));
  });
};

export const removeSharedNodes = (state: Draft<DiagramState>, diagramID: string, nodeIDs: string[]) => {
  const nodeIDMap = Utils.array.createMap(nodeIDs);
  const diagram = Normal.getOne(state, diagramID);

  if (diagram) {
    diagram.menuItems = diagram.menuItems.filter(({ type, sourceID }) => type !== BaseModels.Diagram.MenuItemType.NODE || !nodeIDMap[sourceID]);
  }

  const diagramSharedNodes = state.sharedNodes[diagramID];
  const diagramGlobalIntents = state.globalIntentStepMap[diagramID];

  if (!diagramSharedNodes) return;

  nodeIDs.forEach((nodeID) => {
    const sharedNode = diagramSharedNodes[nodeID];

    delete diagramSharedNodes[nodeID];

    if (sharedNode?.type === Realtime.BlockType.INTENT && sharedNode.intentID && diagramGlobalIntents?.[sharedNode.intentID]) {
      diagramGlobalIntents[sharedNode.intentID] = Utils.array.withoutValue(diagramGlobalIntents[sharedNode.intentID], nodeID);
    }
  });
};

export const nodeDataToSharedNode = (data: Realtime.NodeData<{}>): Realtime.diagram.sharedNodes.SharedNode | null => {
  if (!Realtime.Utils.typeGuards.isSharedBlockType(data.type)) return null;

  if (Realtime.Utils.typeGuards.isIntentNodeData(data)) {
    const global = !data.availability || data.availability === BaseNode.Intent.IntentAvailability.GLOBAL;

    return { type: Realtime.BlockType.INTENT, global, nodeID: data.nodeID, intentID: data.intent };
  }

  if (Realtime.Utils.typeGuards.isStartNodeData(data)) {
    return { type: Realtime.BlockType.START, nodeID: data.nodeID, name: data.label || '' };
  }

  if (Realtime.Utils.typeGuards.isComponentNodeData(data)) {
    return { type: Realtime.BlockType.COMPONENT, nodeID: data.nodeID, componentID: data.diagramID };
  }

  if (Realtime.Utils.typeGuards.isCombinedBlockType(data.type)) {
    return { type: Realtime.BlockType.COMBINED, name: data.name, nodeID: data.nodeID };
  }

  return null;
};
