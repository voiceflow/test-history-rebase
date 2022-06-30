import { BaseModels } from '@voiceflow/base-types';
import { AnyRecord, Nullish } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { ExtraOptions } from './types';
import createResourceClient from './utils/resource';

export interface RemoveBuiltInLink {
  nodeID: string;
  type: BaseModels.PortType;
}

export interface RemoveDynamicLink {
  nodeID: string;
  portID: string;
}

export interface RemoveByKeyLink {
  nodeID: string;
  key: string;
}

export interface PatchBuiltInLink {
  nodeID: string;
  type: BaseModels.PortType;
  data: Partial<Realtime.LinkData>;
}

export interface PatchDynamicLink {
  nodeID: string;
  portID: string;
  data: Partial<Realtime.LinkData>;
}

export interface PatchByKeyLink {
  nodeID: string;
  key: string;
  data: Partial<Realtime.LinkData>;
}

// utility function to format node update data
const nodeDataUpdates = <D extends AnyRecord>(nodeID: string, data: D) => {
  const entries = Object.entries(data);
  return entries.reduce<{ sets: { path: string; value: any }[]; unsets: { path: string }[]; nodeID: string }>(
    (acc, [path, value]) => {
      if (value == null) {
        acc.unsets.push({ path });
      } else {
        acc.sets.push({ path, value });
      }

      return acc;
    },
    { sets: [], unsets: [], nodeID }
  );
};

const Client = ({ api }: ExtraOptions) => ({
  ...createResourceClient(api, 'diagrams'),

  patch: (diagramID: string, data: Partial<Realtime.Diagram>) => api.patch(`/v3/diagrams/${diagramID}`, data),

  addStep: ({
    step,
    index,
    diagramID,
    parentNodeID,
    nodePortRemaps,
  }: {
    step: BaseModels.BaseDiagramNode;
    index?: Nullish<number>;
    diagramID: string;
    parentNodeID: string;
    nodePortRemaps?: Realtime.NodePortRemap[];
  }) => api.post(`/v2/diagrams/${diagramID}/nodes/${parentNodeID}/steps`, { step, index, nodePortRemaps }),

  addManyNodes: (diagramID: string, nodes: BaseModels.BaseDiagramNode[], nodePortRemaps?: Realtime.NodePortRemap[]) =>
    api.post(`/v2/diagrams/${diagramID}/nodes/bulk`, { nodes, nodePortRemaps }),

  isolateSteps: ({
    stepIDs,
    diagramID,
    parentNode,
    sourceParentNodeID,
  }: {
    stepIDs: string[];
    diagramID: string;
    parentNode: BaseModels.BaseBlock | BaseModels.BaseActions;
    sourceParentNodeID: string;
  }) => api.post(`/v2/diagrams/${diagramID}/nodes/${sourceParentNodeID}/steps/isolate`, { parentNode, stepIDs }),

  reorderSteps: ({
    index,
    stepID,
    diagramID,
    parentNodeID,
    nodePortRemaps,
  }: {
    index: number;
    stepID: string;
    diagramID: string;
    parentNodeID: string;
    nodePortRemaps?: Realtime.NodePortRemap[];
  }) => api.post(`/v2/diagrams/${diagramID}/nodes/${parentNodeID}/steps/reorder`, { stepID, index, nodePortRemaps }),

  transplantSteps: ({
    index,
    stepIDs,
    diagramID,
    removeSource,
    nodePortRemaps,
    sourceParentNodeID,
    targetParentNodeID,
  }: {
    index: number;
    stepIDs: string[];
    diagramID: string;
    removeSource?: boolean;
    nodePortRemaps?: Realtime.NodePortRemap[];
    sourceParentNodeID: string;
    targetParentNodeID: string;
  }) =>
    api.post(`/v2/diagrams/${diagramID}/nodes/${sourceParentNodeID}/steps/transplant`, {
      index,
      stepIDs,
      parentNodeID: targetParentNodeID,
      removeSource,
      nodePortRemaps,
    }),

  updateNodeCoords: (diagramID: string, nodes: Record<string, Realtime.Point>) => api.put(`/v2/diagrams/${diagramID}/nodes/coords`, { nodes }),

  updateManyNodeData: <D extends AnyRecord>(diagramID: string, nodes: { nodeID: string; data: D }[]) => {
    return api.patch(`/v2/diagrams/${diagramID}/nodes/data`, { nodeUpdates: nodes.map(({ nodeID, data }) => nodeDataUpdates(nodeID, data)) });
  },

  removeManyNodes: (diagramID: string, nodes: { parentNodeID: string; stepID?: Nullish<string> }[]) =>
    api.delete(`/v2/diagrams/${diagramID}/nodes`, { data: { nodes } }),

  addByKeyLink: (diagramID: string, nodeID: string, key: string, target: string) =>
    api.post(`/v2/diagrams/${diagramID}/nodes/${nodeID}/links`, { target, key }),

  addBuiltInLink: (diagramID: string, nodeID: string, type: BaseModels.PortType, target: string) =>
    api.post(`/v2/diagrams/${diagramID}/nodes/${nodeID}/links`, { type, target }),

  addDynamicLink: (diagramID: string, nodeID: string, portID: string, target: string) =>
    api.post(`/v2/diagrams/${diagramID}/nodes/${nodeID}/links`, { portID, target }),

  removeManyLinks: (diagramID: string, links: (RemoveBuiltInLink | RemoveDynamicLink | RemoveByKeyLink)[]) =>
    api.delete(`/v2/diagrams/${diagramID}/links`, { data: { links } }),

  patchManyLinks: (diagramID: string, patches: (PatchBuiltInLink | PatchDynamicLink | PatchByKeyLink)[]) =>
    api.patch(`/v2/diagrams/${diagramID}/links`, { patches }),

  removeBuiltInPort: (diagramID: string, nodeID: string, type: BaseModels.PortType) =>
    api.delete(`/v2/diagrams/${diagramID}/nodes/${nodeID}/ports`, { data: { type } }),

  removeByKeyPort: (diagramID: string, nodeID: string, key: string) =>
    api.delete(`/v2/diagrams/${diagramID}/nodes/${nodeID}/ports`, { data: { key } }),

  removeManyByKeyPort: (diagramID: string, nodeID: string, keys: string[]) =>
    api.delete(`/v2/diagrams/${diagramID}/nodes/${nodeID}/many-ports`, { data: { keys } }),

  removeDynamicPort: (diagramID: string, nodeID: string, portID: string) =>
    api.delete(`/v2/diagrams/${diagramID}/nodes/${nodeID}/ports`, { data: { portID } }),

  reorderPorts: (diagramID: string, nodeID: string, portID: string, index: number) =>
    api.post(`/v2/diagrams/${diagramID}/nodes/${nodeID}/ports/reorder`, { portID, index }),

  addByKeyPort: (diagramID: string, nodeID: string, port: BaseModels.BasePort, key: string) =>
    api.post(`/v2/diagrams/${diagramID}/nodes/${nodeID}/ports`, { port, key }),

  addBuiltInPort: (diagramID: string, nodeID: string, port: BaseModels.BasePort, type: BaseModels.PortType) =>
    api.post(`/v2/diagrams/${diagramID}/nodes/${nodeID}/ports`, { port, type }),

  addDynamicPort: (diagramID: string, nodeID: string, port: BaseModels.BasePort, index: number | null = null) =>
    api.post(`/v2/diagrams/${diagramID}/nodes/${nodeID}/ports`, { port, index }),
});

export default Client;

export type DiagramClient = ReturnType<typeof Client>;
