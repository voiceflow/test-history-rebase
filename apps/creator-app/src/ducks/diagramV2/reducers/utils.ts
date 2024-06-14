import { BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { TriggerNodeItemType } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Draft } from 'immer';

import { createCombinedReducerFactory, createReducerFactory } from '@/ducks/utils';

import { DiagramState } from '../types';

export const createReducer = createReducerFactory<DiagramState>();
export const createCombinedReducer = createCombinedReducerFactory<DiagramState>();

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
export const removeDiagramSharedNodes = (state: Draft<DiagramState>, diagramID: string) => {
  delete state.sharedNodes[diagramID];
  delete state.globalIntentStepMap[diagramID];
};

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
export const addSharedNode = (
  state: Draft<DiagramState>,
  diagramID: string,
  sharedNode: Realtime.diagram.sharedNodes.SharedNode | null
) => {
  if (!sharedNode) return;

  state.sharedNodes[diagramID][sharedNode.nodeID] = sharedNode;

  if (sharedNode.type === Realtime.BlockType.INTENT) {
    if (!sharedNode.intentID || !sharedNode.global) return;

    state.globalIntentStepMap[diagramID] ??= {};
    state.globalIntentStepMap[diagramID][sharedNode.intentID] ??= [];
    state.globalIntentStepMap[diagramID][sharedNode.intentID].push(sharedNode.nodeID);
  } else if (sharedNode.type === Realtime.BlockType.TRIGGER || sharedNode.type === Realtime.BlockType.START) {
    const triggers = sharedNode.type === Realtime.BlockType.TRIGGER ? sharedNode.items : sharedNode.triggers;

    triggers.forEach((item) => {
      if (item.type !== TriggerNodeItemType.INTENT || !item.resourceID || item.settings.local) return;

      state.globalIntentStepMap[diagramID] ??= {};
      state.globalIntentStepMap[diagramID][item.resourceID] ??= [];
      state.globalIntentStepMap[diagramID][item.resourceID].push(sharedNode.nodeID);
    });
  }
};

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
export const addSharedNodeAndMenuItem = (
  state: Draft<DiagramState>,
  diagramID: string,
  sharedNode: Realtime.diagram.sharedNodes.SharedNode | null
) => {
  if (!sharedNode) return;

  addSharedNode(state, diagramID, sharedNode);
};

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
export const addSharedNodes = (
  state: Draft<DiagramState>,
  sharedNodes: Realtime.diagram.sharedNodes.DiagramSharedNodeMap
) => {
  Object.entries(sharedNodes).forEach(([diagramID, sharedNodeMap]) => {
    state.sharedNodes[diagramID] = {};
    state.globalIntentStepMap[diagramID] = {};

    Object.values(sharedNodeMap).forEach((sharedNode) => sharedNode && addSharedNode(state, diagramID, sharedNode));
  });
};

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
export const removeSharedNodes = (state: Draft<DiagramState>, diagramID: string, nodeIDs: string[]) => {
  const diagramSharedNodes = state.sharedNodes[diagramID];
  const diagramGlobalIntents = state.globalIntentStepMap[diagramID];

  if (!diagramSharedNodes || !diagramGlobalIntents) return;

  nodeIDs.forEach((nodeID) => {
    const sharedNode = diagramSharedNodes[nodeID];

    delete diagramSharedNodes[nodeID];

    if (!sharedNode) return;

    if (sharedNode.type === Realtime.BlockType.INTENT) {
      if (!sharedNode.intentID || !diagramGlobalIntents[sharedNode.intentID]) return;

      diagramGlobalIntents[sharedNode.intentID] = Utils.array.withoutValue(
        diagramGlobalIntents[sharedNode.intentID],
        nodeID
      );
    } else if (sharedNode.type === Realtime.BlockType.TRIGGER || sharedNode.type === Realtime.BlockType.START) {
      const triggers = sharedNode.type === Realtime.BlockType.TRIGGER ? sharedNode.items : sharedNode.triggers;

      triggers.forEach((item) => {
        if (item.type !== TriggerNodeItemType.INTENT || !item.resourceID || !diagramGlobalIntents[item.resourceID])
          return;

        diagramGlobalIntents[item.resourceID] = Utils.array.withoutValue(diagramGlobalIntents[item.resourceID], nodeID);
      });
    }
  });
};

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const nodeDataToSharedNode = (data: Realtime.NodeData<{}>): Realtime.diagram.sharedNodes.SharedNode | null => {
  if (!Realtime.Utils.typeGuards.isSharedBlockType(data.type)) return null;

  if (Realtime.Utils.typeGuards.isIntentNodeData(data)) {
    const global = !data.availability || data.availability === BaseNode.Intent.IntentAvailability.GLOBAL;

    return { type: Realtime.BlockType.INTENT, global, nodeID: data.nodeID, intentID: data.intent };
  }

  if (Realtime.Utils.typeGuards.isTriggerNodeData(data)) {
    return { type: Realtime.BlockType.TRIGGER, nodeID: data.nodeID, items: data.items };
  }

  if (Realtime.Utils.typeGuards.isStartNodeData(data)) {
    return { type: Realtime.BlockType.START, nodeID: data.nodeID, name: data.label || '', triggers: data.triggers };
  }

  if (Realtime.Utils.typeGuards.isCombinedBlockType(data.type)) {
    return { type: Realtime.BlockType.COMBINED, name: data.name, nodeID: data.nodeID };
  }

  return null;
};
