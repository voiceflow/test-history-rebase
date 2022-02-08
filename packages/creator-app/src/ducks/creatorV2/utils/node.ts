import { Models } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Draft } from 'immer';
import * as Normal from 'normal-store';

import { CreatorState } from '../types';
import { addBuiltinPort, addDynamicPort, addPort, createEmptyNodePorts } from './port';

export const addNode = (state: Draft<CreatorState>, { nodeID, data }: { nodeID: string; data: Realtime.NodeDataDescriptor<unknown> }): void => {
  state.nodes = Normal.appendOne(state.nodes, nodeID, { ...data, nodeID });
};

export const addNodeWithPorts = (
  state: Draft<CreatorState>,
  { nodeID, data, ports }: { nodeID: string; data: Realtime.NodeDataDescriptor<unknown>; ports: Realtime.PortsDescriptor }
): void => {
  state.portsByNodeID[nodeID] = createEmptyNodePorts();
  state.linkIDsByNodeID[nodeID] = [];

  addNode(state, { nodeID, data });

  Object.entries(ports.out.builtIn).forEach(([type, port]) =>
    addBuiltinPort(state, {
      nodeID,
      portID: port.id,
      type: type as Models.PortType,
      platform: port.platform,
    })
  );

  ports.out.dynamic.forEach((port) =>
    addDynamicPort(state, {
      nodeID,
      portID: port.id,
      label: port.label,
    })
  );

  ports.in.forEach((port) => {
    addPort(
      state,
      (ports) => {
        ports.in.push(port.id);
      },
      {
        nodeID,
        portID: port.id,
      }
    );
  });
};

export const addStepReferences = (
  state: Draft<CreatorState>,
  updateSteps: (stepIDs: string[]) => string[],
  { blockID, stepID }: { blockID: string; stepID: string }
): void => {
  const stepIDs = state.stepIDsByBlockID[blockID] ?? [];

  state.blockIDByStepID[stepID] = blockID;
  state.stepIDsByBlockID[blockID] = updateSteps(stepIDs);
};

export const removeStepReferences = (state: Draft<CreatorState>, { blockID, stepID }: { blockID: string; stepID: string }): void => {
  const stepIDs = state.stepIDsByBlockID[blockID] ?? [];

  delete state.blockIDByStepID[stepID];
  state.stepIDsByBlockID[blockID] = Utils.array.withoutValue(stepIDs, stepID);
};

export const addStep = (
  state: Draft<CreatorState>,
  updateSteps: (stepIDs: string[]) => string[],
  { blockID, stepID, data, ports }: { blockID: string; stepID: string; data: Realtime.NodeDataDescriptor<unknown>; ports: Realtime.PortsDescriptor }
): void => {
  if (Normal.hasOne(state.nodes, stepID)) return;
  if (!Normal.hasOne(state.nodes, blockID)) return;

  addStepReferences(state, updateSteps, { blockID, stepID });
  addNodeWithPorts(state, { nodeID: stepID, data, ports });
};
