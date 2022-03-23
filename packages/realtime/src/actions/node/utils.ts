import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

export const buildPort = (nodeID: string) => {
  return (port: Realtime.PortDescriptor) => ({
    ...port,
    nodeID,
    label: port.label ?? null,
    platform: port.platform ?? null,
    virtual: !!port.virtual,
  });
};

export interface ExtractNodesOptions extends Partial<Pick<Realtime.CreatorDiagram, 'rootNodeIDs' | 'markupNodeIDs'>> {
  ports?: Record<string, Realtime.PortsDescriptor>;
  data: Record<string, Realtime.NodeDataDescriptor<unknown>>;
  nodes: Realtime.Node[];
}

export const extractNodes = (
  diagramID: string,
  projectMeta: Realtime.ProjectMeta,
  { ports: portDescriptors = {}, data: dataDescriptors, nodes, ...options }: ExtractNodesOptions
): BaseModels.BaseDiagramNode[] => {
  const ports = Object.entries(portDescriptors).flatMap(([nodeID, ports]) => Realtime.Utils.port.flattenAllPorts(ports).map(buildPort(nodeID)));
  const data = Object.fromEntries(Object.entries(dataDescriptors).map(([nodeID, data]) => [nodeID, { ...data, nodeID }]));

  const { nodes: dbNodes } = Realtime.Adapters.creatorAdapter.toDB(
    {
      rootNodeIDs: [],
      markupNodeIDs: [],

      ...options,
      diagramID,
      data,

      // the rest of these can safely be left empty
      viewport: { x: 0, y: 0, zoom: 0 },
      nodes: [],
      ports: [],
      links: [],
    },
    {
      platform: projectMeta.platform,
      projectType: projectMeta.type,
      nodes: normalize(nodes),
      ports: normalize(ports),
      context: {},
    }
  );

  return Object.values(dbNodes);
};
