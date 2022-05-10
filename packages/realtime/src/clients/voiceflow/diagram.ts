import { BaseModels } from '@voiceflow/base-types';
import { AnyRecord, Nullish } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { ExtraOptions } from './types';

export interface RemoveBuiltInLink {
  nodeID: string;
  type: BaseModels.PortType;
}

export interface RemoveDynamicLink {
  nodeID: string;
  portID: string;
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

const Client = ({ api }: ExtraOptions) => ({
  canRead: (creatorID: number, diagramID: string) =>
    api
      .head(`/v2/user/${creatorID}/diagrams/${diagramID}`)
      .then(() => true)
      .catch(() => false),

  patch: (diagramID: string, data: Partial<Realtime.Diagram>) => api.patch(`/v3/diagrams/${diagramID}`, data),

  addStep: (diagramID: string, blockID: string, step: BaseModels.BaseDiagramNode, index?: Nullish<number>) =>
    api.post(`/v2/diagrams/${diagramID}/nodes/${blockID}/steps`, { step, index }),

  addManyNodes: (diagramID: string, nodes: BaseModels.BaseDiagramNode[]) => api.post(`/v2/diagrams/${diagramID}/nodes/bulk`, { nodes }),

  isolateStep: (diagramID: string, sourceBlockID: string, block: BaseModels.BaseDiagramNode, stepID: string) =>
    api.post(`/v2/diagrams/${diagramID}/nodes/${sourceBlockID}/steps/isolate`, { block, stepID }),

  reorderSteps: (diagramID: string, blockID: string, stepID: string, index: number) =>
    api.post(`/v2/diagrams/${diagramID}/nodes/${blockID}/steps/reorder`, { stepID, index }),

  transplantSteps: (diagramID: string, sourceBlockID: string, targetBlockID: string, stepIDs: string[], index: number) =>
    api.post(`/v2/diagrams/${diagramID}/nodes/${sourceBlockID}/steps/transplant`, { blockID: targetBlockID, stepIDs, index }),

  updateBlockCoords: (diagramID: string, blocks: Record<string, Realtime.Point>) => api.put(`/v2/diagrams/${diagramID}/nodes/coords`, { blocks }),

  updateNodeData: <D extends AnyRecord>(diagramID: string, nodeID: string, data: D) => {
    const entries = Object.entries(data);
    const updates = entries.reduce<{ sets: { path: string; value: any }[]; unsets: { path: string }[] }>(
      (acc, [path, value]) => {
        if (value == null) {
          acc.unsets.push({ path });
        } else {
          acc.sets.push({ path, value });
        }

        return acc;
      },
      { sets: [], unsets: [] }
    );

    return api.patch(`/v2/diagrams/${diagramID}/nodes/${nodeID}/data`, { updates });
  },

  removeManyNodes: (diagramID: string, nodes: { blockID: string; stepID?: Nullish<string> }[]) =>
    api.delete(`/v2/diagrams/${diagramID}/nodes`, { data: { nodes } }),

  addBuiltInLink: (diagramID: string, nodeID: string, type: BaseModels.PortType, target: string) =>
    api.post(`/v2/diagrams/${diagramID}/nodes/${nodeID}/links`, { type, target }),

  addDynamicLink: (diagramID: string, nodeID: string, portID: string, target: string) =>
    api.post(`/v2/diagrams/${diagramID}/nodes/${nodeID}/links`, { portID, target }),

  removeManyLinks: (diagramID: string, links: (RemoveBuiltInLink | RemoveDynamicLink)[]) =>
    api.delete(`/v2/diagrams/${diagramID}/links`, { data: { links } }),

  patchManyLinks: (diagramID: string, patches: (PatchBuiltInLink | PatchDynamicLink)[]) => api.patch(`/v2/diagrams/${diagramID}/links`, { patches }),

  removeBuiltInPort: (diagramID: string, nodeID: string, type: BaseModels.PortType) =>
    api.delete(`/v2/diagrams/${diagramID}/nodes/${nodeID}/ports`, { data: { type } }),

  removeDynamicPort: (diagramID: string, nodeID: string, portID: string) =>
    api.delete(`/v2/diagrams/${diagramID}/nodes/${nodeID}/ports`, { data: { portID } }),

  reorderPorts: (diagramID: string, nodeID: string, portID: string, index: number) =>
    api.post(`/v2/diagrams/${diagramID}/nodes/${nodeID}/ports/reorder`, { portID, index }),

  addBuiltInPort: (diagramID: string, nodeID: string, port: BaseModels.BasePort, type: BaseModels.PortType) =>
    api.post(`/v2/diagrams/${diagramID}/nodes/${nodeID}/ports`, { port, type }),

  addDynamicPort: (diagramID: string, nodeID: string, port: BaseModels.BasePort, index: number | null = null) =>
    api.post(`/v2/diagrams/${diagramID}/nodes/${nodeID}/ports`, { port, index }),
});

export default Client;

export type DiagramClient = ReturnType<typeof Client>;
