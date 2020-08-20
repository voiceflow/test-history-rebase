import { Diagram, DiagramNode, NodeID } from '@voiceflow/api-sdk';

import { createSimpleAdapter } from '@/client/adapters/utils';
import { MARKUP_NODES, PlatformType } from '@/constants';
import { CreatorDiagram, Link, Node, NodeData, Port } from '@/models';
import { Normalized, denormalize } from '@/utils/normalized';
import { getCurrentTimestamp } from '@/utils/time';

import nodeAdapter from './node';
import { isBlock } from './utils';

// we will be doing a patch request
export type DBCreatorDiagram = Omit<Diagram, 'created' | 'creatorID' | 'variables' | 'versionID' | 'name'>;

const creatorAdapter = createSimpleAdapter<
  DBCreatorDiagram,
  CreatorDiagram,
  [PlatformType],
  [
    {
      nodes: Normalized<Node>;
      ports: Normalized<Port>;
    }
  ]
>(
  (diagram) => {
    const rootNodeIDs: string[] = [];
    const nodes: Node[] = [];
    const nodeIDs = new Set<string>();

    const links: Link[] = [];

    const ports: Port[] = [];
    const portIDs = new Set<string>();

    const data: Record<string, NodeData<unknown>> = {};
    const markupNodeIDs: string[] = [];

    const parentNodes = Object.values(diagram.nodes).reduce<Record<string, string>>((acc, node) => {
      if (isBlock(node)) {
        node.data.steps.forEach((stepID) => {
          acc[stepID] = node.nodeID;
        });
      }
      return acc;
    }, {});

    const registerNode = (dbNode: DiagramNode) => {
      const { node, data: nodeData, ports: nodePorts } = nodeAdapter.fromDB(dbNode, { parentNode: parentNodes[dbNode.nodeID], links });

      nodes.push(node);
      nodeIDs.add(node.id);
      data[node.id] = nodeData;
      nodePorts.forEach((port) => {
        ports.push(port);
        portIDs.add(port.id);
      });

      if (MARKUP_NODES.includes(node.type)) {
        markupNodeIDs.push(node.id);
        return;
      }

      rootNodeIDs.push(node.id);
    };

    Object.values(diagram.nodes).forEach(registerNode);

    // extra safeguard against targeting non-existent nodes or ports
    const validLinks = links.filter(
      (link) =>
        nodeIDs.has(link.source.nodeID) && nodeIDs.has(link.target.nodeID) && portIDs.has(link.source.portID) && portIDs.has(link.target.portID)
    );

    return {
      diagramID: diagram._id,
      viewport: {
        x: diagram.offsetX,
        y: diagram.offsetY,
        zoom: diagram.zoom,
      },
      rootNodeIDs,
      nodes,
      links: validLinks,
      ports,
      data,
      markupNodeIDs,
    };
  },
  ({ diagramID, viewport, links, data }, { nodes, ports }) => {
    const nodeList = denormalize(nodes);

    const portToTargets = links.reduce<Record<string, NodeID>>((acc, link) => {
      if (link.source.portID in ports.byKey && link.target.nodeID in nodes.byKey) {
        acc[link.source.portID] = link.target.nodeID;
      }
      return acc;
    }, {});

    return {
      _id: diagramID,
      offsetX: viewport.x,
      offsetY: viewport.y,
      zoom: viewport.zoom,
      modified: getCurrentTimestamp(),
      nodes: nodeList.reduce<Record<string, DiagramNode>>(
        (acc, node) => ({
          ...acc,
          [node.id]: nodeAdapter.toDB({ node, data: data[node.id], ports: node.ports.out.map((portID) => ports.byKey[portID]) }, { portToTargets }),
        }),
        {}
      ),
    };
  }
);

export default creatorAdapter;
