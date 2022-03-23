import { BaseModels } from '@voiceflow/base-types';
import { Nullish } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { ExtraOptions } from './types';

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

  removeManyNodes: (diagramID: string, nodes: { blockID: string; stepID?: Nullish<string> }[]) =>
    api.delete(`/v2/diagrams/${diagramID}/nodes`, { data: { nodes } }),

  addLink: (diagramID: string, nodeID: string, portID: string, target: string) =>
    api.post(`/v2/diagrams/${diagramID}/links`, { nodeID, portID, target }),

  removeManyLinks: (diagramID: string, links: { nodeID: string; portID: string }[]) =>
    api.delete(`/v2/diagrams/${diagramID}/links`, { data: { links } }),

  patchManyLinks: (diagramID: string, patches: { nodeID: string; portID: string }[]) => api.patch(`/v2/diagrams/${diagramID}/links`, { patches }),

  removePort: (diagramID: string, nodeID: string, portID: string) => api.delete(`/v2/diagrams/${diagramID}/nodes/${nodeID}/ports/${portID}`),

  reorderPorts: (diagramID: string, nodeID: string, portID: string, index: number) =>
    api.post(`/v2/diagrams/${diagramID}/nodes/${nodeID}/ports/reorder`, { portID, index }),

  addPort: (diagramID: string, nodeID: string, port: BaseModels.BasePort, index?: number) =>
    api.post(`/v2/diagrams/${diagramID}/nodes/${nodeID}/ports`, { port, index }),
});

export default Client;

export type DiagramClient = ReturnType<typeof Client>;
