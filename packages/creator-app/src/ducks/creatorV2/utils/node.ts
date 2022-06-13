import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Draft } from 'immer';
import * as Normal from 'normal-store';

import { CreatorState } from '../types';
import { addBuiltinPort, addByKeyPort, addDynamicPort, addPort, removePort } from './port';

export const addNode = (state: Draft<CreatorState>, { nodeID, data }: { nodeID: string; data: Realtime.NodeDataDescriptor<unknown> }): void => {
  state.nodes = Normal.appendOne(state.nodes, nodeID, { ...data, nodeID });
};

export const addNodeWithPorts = (
  state: Draft<CreatorState>,
  { nodeID, data, ports }: { nodeID: string; data: Realtime.NodeDataDescriptor<unknown>; ports: Realtime.PortsDescriptor }
): void => {
  state.portsByNodeID[nodeID] = Realtime.Utils.port.createEmptyNodePorts();
  state.linkIDsByNodeID[nodeID] = [];

  addNode(state, { nodeID, data });

  Object.entries(ports.out.builtIn).forEach(([type, port]) =>
    addBuiltinPort(state, {
      nodeID,
      portID: port.id,
      type: type as BaseModels.PortType,
    })
  );

  Object.entries(ports.out.byKey || {}).forEach(([key, port]) =>
    addByKeyPort(state, {
      key,
      nodeID,
      portID: port.id,
      label: port.label,
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
  updateSteps: (currentStepIDs: string[]) => string[],
  { blockID, stepIDs }: { blockID: string; stepIDs: string[] }
): void => {
  const currentStepIDs = state.stepIDsByBlockID[blockID] ?? [];

  stepIDs.forEach((stepID) => {
    state.blockIDByStepID[stepID] = blockID;
  });
  state.stepIDsByBlockID[blockID] = updateSteps(currentStepIDs);
};

export const removeStepReferences = (state: Draft<CreatorState>, { blockID, stepIDs }: { blockID: string; stepIDs: string[] }): void => {
  const currentStepIDs = state.stepIDsByBlockID[blockID] ?? [];

  stepIDs.forEach((stepID) => delete state.blockIDByStepID[stepID]);
  state.stepIDsByBlockID[blockID] = Utils.array.withoutValues(currentStepIDs, stepIDs);
};

export const removeManyNodes = (state: Draft<CreatorState>, nodeIDs: string[]): void => {
  const nodesToRemove = new Set<string>(nodeIDs);
  const portsToRemove: string[] = [];

  const registerPorts = (nodeID: string) => {
    const portIDs = Realtime.Utils.port.flattenAllPorts(state.portsByNodeID[nodeID]);

    portsToRemove.push(...portIDs);
  };

  nodeIDs.forEach((nodeID) => {
    const stepIDs = state.stepIDsByBlockID[nodeID] ?? [];

    stepIDs.forEach((stepID) => {
      nodesToRemove.add(stepID);
      registerPorts(stepID);
    });

    registerPorts(nodeID);
  });

  const removeNodeReferences = (nodeID: string) => {
    const blockID = state.blockIDByStepID[nodeID] ?? null;

    if (blockID && !nodesToRemove.has(blockID)) {
      removeStepReferences(state, { blockID, stepIDs: [nodeID] });
    }

    delete state.coordsByNodeID[nodeID];
    delete state.stepIDsByBlockID[nodeID];
    delete state.blockIDByStepID[nodeID];
    delete state.portsByNodeID[nodeID];
    delete state.linkIDsByNodeID[nodeID];
  };

  portsToRemove.forEach((portID) => {
    // removePort will also cleanup any relevant links
    removePort(state, portID);
  });
  nodesToRemove.forEach(removeNodeReferences);

  const nodesToRemoveArr = Array.from(nodesToRemove);

  state.markupIDs = Utils.array.withoutValues(state.markupIDs, nodesToRemoveArr);
  state.blockIDs = Utils.array.withoutValues(state.blockIDs, nodesToRemoveArr);
  state.nodes = Normal.removeMany(state.nodes, nodesToRemoveArr);
};

export const addStep = (
  state: Draft<CreatorState>,
  updateSteps: (stepIDs: string[]) => string[],
  {
    blockID,
    stepID,
    data,
    ports,
  }: {
    blockID: string;
    stepID: string;
    data: Realtime.NodeDataDescriptor<unknown>;
    ports: Realtime.PortsDescriptor;
  }
): void => {
  if (Normal.hasOne(state.nodes, stepID)) return;
  if (!Normal.hasOne(state.nodes, blockID)) return;

  addStepReferences(state, updateSteps, { blockID, stepIDs: [stepID] });
  addNodeWithPorts(state, { nodeID: stepID, data, ports });
};

export const orphanSteps = (
  state: Draft<CreatorState>,
  adoptOrphan: () => void,
  { blockID, stepIDs }: { blockID: string; stepIDs: string[] }
): void => {
  if (!Normal.hasMany(state.nodes, [blockID, ...stepIDs])) return;

  removeStepReferences(state, { blockID, stepIDs });
  adoptOrphan();

  const currentStepIDs = state.stepIDsByBlockID[blockID] ?? [];
  if (!currentStepIDs.length) {
    removeManyNodes(state, [blockID]);
  }
};
