/* eslint-disable max-params */

import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import { BLOCK_WIDTH } from '@/styles/theme';
import { Point } from '@/types';

import { getNodesGroupCenter } from './node';

export interface CreateDiagramWithDataOptions {
  data: Record<string, Realtime.NodeData<unknown>>;
  nodes: Realtime.Node[];
  links: Realtime.Link[];
  ports: Realtime.Port[];
  startCoords?: Point;
}

export const getDiagramToCreate = (
  platform: Platform.Constants.PlatformType,
  projectType: Platform.Constants.ProjectType,
  schemaVersion: Realtime.SchemaVersion,
  allNodesLinks: Realtime.Link[],
  options: CreateDiagramWithDataOptions
) => {
  const { data, nodes, links, ports, startCoords = [0, 0] } = options;
  const nodeIDMap = nodes.reduce<Record<string, boolean>>((acc, node) => Object.assign(acc, { [node.id]: true }), {});
  const incomingLinks = allNodesLinks.filter(({ source, target }) => nodeIDMap[target.nodeID] && !nodeIDMap[source.nodeID]);
  const outgoingLinks = allNodesLinks.filter(({ source, target }) => !nodeIDMap[target.nodeID] && nodeIDMap[source.nodeID]);

  const { center, minX } = getNodesGroupCenter(
    nodes.map((node) => ({ data: data[node.id], node })),
    links
  );

  const adjustX = startCoords[0] - minX + BLOCK_WIDTH * 1.5;
  const adjustY = startCoords[1] - center[1];

  const adjustPathPoint = (point: Realtime.PathPoint): Realtime.PathPoint => ({
    ...point,
    point: [point.point[0] + adjustX, point.point[1] + adjustY],
  });

  const adjustedNodes = nodes.map((node) => ({ ...node, x: node.x + adjustX, y: node.y + adjustY }));
  const adjustedPorts = ports.map((port) =>
    port.linkData?.points ? { ...port, linkData: { ...port.linkData, points: port.linkData.points.map(adjustPathPoint) } } : port
  );
  const adjustedLinks = links.map((link) =>
    link.data?.points ? { ...link, data: { ...link.data, points: link.data.points.map(adjustPathPoint) } } : link
  );

  const dbCreatorDiagram = Realtime.Adapters.creatorAdapter.toDB(
    {
      data,
      ports: [],
      nodes: [],
      links: adjustedLinks,
      viewport: { zoom: 1, x: 0, y: 0 },
      rootNodeIDs: [],
      markupNodeIDs: [],
    },
    { nodes: normalize(adjustedNodes), ports: normalize(adjustedPorts), platform, projectType, context: { schemaVersion } }
  );

  return {
    incomingLinks,
    outgoingLinks,
    dbCreatorDiagram,
  };
};

export const convertSelectionToComponent = (
  platform: Platform.Constants.PlatformType,
  projectType: Platform.Constants.ProjectType,
  schemaVersion: Realtime.SchemaVersion,
  allNodesLinks: Realtime.Link[],
  { startCoords = Realtime.START_NODE_POSITION, ...options }: CreateDiagramWithDataOptions,
  totalNumberOfComponents: number
) => {
  const name = `Component ${totalNumberOfComponents + 1}`;
  const component = Realtime.Utils.diagram.componentDiagramFactory(name, startCoords);

  const { incomingLinks, outgoingLinks, dbCreatorDiagram } = getDiagramToCreate(platform, projectType, schemaVersion, allNodesLinks, {
    startCoords,
    ...options,
  });

  component.nodes = { ...component.nodes, ...dbCreatorDiagram.nodes };

  if (incomingLinks.length === 1) {
    const incomingLink = incomingLinks[0];

    const startNode = Object.values(component.nodes).find((node) => node.type === BaseNode.NodeType.START);
    const connectedNode = Object.values(component.nodes).find((node) => node.nodeID === incomingLink.target.nodeID);
    const startNodeNextPort = startNode?.data.portsV2?.builtIn[BaseModels.PortType.NEXT];

    if (startNode && connectedNode && startNodeNextPort) {
      startNodeNextPort.target = connectedNode.nodeID;
    }
  }

  return { component, incomingLinks, outgoingLinks, name };
};
