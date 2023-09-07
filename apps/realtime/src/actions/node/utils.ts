import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { normalize } from 'normal-store';

export const buildPort = (nodeID: string) => {
  return (port: Realtime.PortDescriptor): Realtime.Port => ({
    ...port,
    nodeID,
    label: port.label ?? null,
  });
};

export const buildDBBlock = (nodeID: string, coords: Realtime.Point, data: BaseModels.BaseBlock['data']): BaseModels.BaseBlock => ({
  type: BaseModels.BaseNodeType.BLOCK,
  data,
  coords,
  nodeID,
});

export const buildDBActions = (nodeID: string, data: BaseModels.BaseActions['data'], coords?: Realtime.Point): BaseModels.BaseActions => ({
  type: BaseModels.BaseNodeType.ACTIONS,
  data,
  coords,
  nodeID,
});

export const buildDBStep = <Step extends BaseModels.BaseStep>(nodeID: string, type: Step['type'], data: Step['data']): Step =>
  ({ nodeID, type, data } as Step);

export interface ExtractNodesOptions extends Partial<Pick<Realtime.CreatorDiagram, 'rootNodeIDs' | 'markupNodeIDs'>> {
  data: Record<string, Realtime.NodeDataDescriptor<unknown>>;
  nodes: Realtime.Node[];
  ports?: Record<string, Realtime.PortsDescriptor>;
}

export const extractNodes = (
  diagramID: string,
  projectMeta: Realtime.ProjectMeta,
  schemaVersion: Realtime.SchemaVersion,
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
      nodes: normalize(nodes),
      ports: normalize(ports),
      context: { schemaVersion },
      platform: projectMeta.platform,
      projectType: projectMeta.type,
    }
  );

  return Object.values(dbNodes);
};
