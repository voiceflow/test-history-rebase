import { BaseModels } from '@voiceflow/base-types';
import { Utils, WithRequired } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Draft } from 'immer';
import * as Normal from 'normal-store';
import { Overwrite } from 'utility-types';

import { CreatorState } from '../types';
import { addBuiltinPort, addByKeyPort, addDynamicPort, addPort, removePort } from './port';

export const nodeFactory = <T extends string>(
  nodeID: T,
  node: WithRequired<Partial<Realtime.Node>, 'type'>
): Overwrite<Realtime.Node, { id: T }> => ({
  x: 0,
  y: 0,
  parentNode: null,
  combinedNodes: [],
  ports: {
    in: [],
    out: {
      byKey: {},
      dynamic: [],
      builtIn: {},
    },
  },
  ...node,
  id: nodeID,
});

export const nodeDataFactory = (nodeID: string, data: WithRequired<Partial<Realtime.NodeData<unknown>>, 'type'>): Realtime.NodeData<unknown> => ({
  name: 'Block',
  ...data,
  nodeID,
});

export const blockNodeDataFactory = (nodeID: string, data: Partial<Realtime.BlockNodeData<unknown>> = {}): Realtime.BlockNodeData<unknown> => ({
  blockColor: '',
  ...nodeDataFactory(nodeID, { type: Realtime.BlockType.COMBINED, ...data }),
});

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
  { parentNodeID, stepIDs }: { parentNodeID: string; stepIDs: string[] }
): void => {
  const currentStepIDs = state.stepIDsByParentNodeID[parentNodeID] ?? [];

  stepIDs.forEach((stepID) => {
    state.parentNodeIDByStepID[stepID] = parentNodeID;
  });
  state.stepIDsByParentNodeID[parentNodeID] = updateSteps(currentStepIDs);
};

export const removeStepReferences = (state: Draft<CreatorState>, { parentNodeID, stepIDs }: { parentNodeID: string; stepIDs: string[] }): void => {
  const currentStepIDs = state.stepIDsByParentNodeID[parentNodeID] ?? [];

  stepIDs.forEach((stepID) => delete state.parentNodeIDByStepID[stepID]);
  state.stepIDsByParentNodeID[parentNodeID] = Utils.array.withoutValues(currentStepIDs, stepIDs);
};

export const removeManyNodes = (state: Draft<CreatorState>, nodeIDs: string[]): void => {
  const nodesToRemove = new Set<string>(nodeIDs);
  const portsToRemove: string[] = [];

  const registerPorts = (nodeID: string) => {
    const portIDs = Realtime.Utils.port.flattenAllPorts(state.portsByNodeID[nodeID]);

    portsToRemove.push(...portIDs);
  };

  nodeIDs.forEach((nodeID) => {
    const stepIDs = state.stepIDsByParentNodeID[nodeID] ?? [];

    stepIDs.forEach((stepID) => {
      nodesToRemove.add(stepID);
      registerPorts(stepID);
    });

    registerPorts(nodeID);
  });

  const removeNodeReferences = (nodeID: string) => {
    const parentNodeID = state.parentNodeIDByStepID[nodeID] ?? null;

    if (parentNodeID && !nodesToRemove.has(parentNodeID)) {
      removeStepReferences(state, { parentNodeID, stepIDs: [nodeID] });
    }

    delete state.portsByNodeID[nodeID];
    delete state.coordsByNodeID[nodeID];
    delete state.parentNodeIDByStepID[nodeID];
    delete state.stepIDsByParentNodeID[nodeID];
    delete state.linkIDsByNodeID[nodeID];
  };

  portsToRemove.forEach((portID) => {
    // removePort will also cleanup any relevant links
    removePort(state, portID);
  });
  nodesToRemove.forEach(removeNodeReferences);

  const nodesToRemoveArr = Array.from(nodesToRemove);

  state.nodes = Normal.removeMany(state.nodes, nodesToRemoveArr);
  state.blockIDs = Utils.array.withoutValues(state.blockIDs, nodesToRemoveArr);
  state.markupIDs = Utils.array.withoutValues(state.markupIDs, nodesToRemoveArr);
  state.actionsIDs = Utils.array.withoutValues(state.actionsIDs, nodesToRemoveArr);
};

export const addStep = (
  state: Draft<CreatorState>,
  updateSteps: (stepIDs: string[]) => string[],
  {
    parentNodeID,
    stepID,
    data,
    ports,
  }: {
    parentNodeID: string;
    stepID: string;
    data: Realtime.NodeDataDescriptor<unknown>;
    ports: Realtime.PortsDescriptor;
  }
): void => {
  if (Normal.hasOne(state.nodes, stepID)) return;
  if (!Normal.hasOne(state.nodes, parentNodeID)) return;

  addStepReferences(state, updateSteps, { parentNodeID, stepIDs: [stepID] });
  addNodeWithPorts(state, { nodeID: stepID, data, ports });
};

export const addManySteps = (
  state: Draft<CreatorState>,
  updateSteps: (stepIDs: string[]) => string[],
  {
    parentNodeID,
    steps,
  }: {
    parentNodeID: string;
    steps: { stepID: string; data: Realtime.NodeDataDescriptor<unknown>; ports: Realtime.PortsDescriptor }[];
  }
): void => {
  if (!Normal.hasOne(state.nodes, parentNodeID)) return;

  const stepIDs: string[] = [];

  steps.forEach(({ stepID, data, ports }) => {
    if (Normal.hasOne(state.nodes, stepID)) return;
    stepIDs.push(stepID);
    addNodeWithPorts(state, { nodeID: stepID, data, ports });
  });

  addStepReferences(state, updateSteps, { parentNodeID, stepIDs });
};

export const orphanSteps = (
  state: Draft<CreatorState>,
  adoptOrphan: () => void,
  { parentNodeID, stepIDs }: { parentNodeID: string; stepIDs: string[] }
): void => {
  if (!Normal.hasMany(state.nodes, [parentNodeID, ...stepIDs])) return;

  removeStepReferences(state, { parentNodeID, stepIDs });
  adoptOrphan();

  const currentStepIDs = state.stepIDsByParentNodeID[parentNodeID] ?? [];
  if (!currentStepIDs.length) {
    removeManyNodes(state, [parentNodeID]);
  }
};
