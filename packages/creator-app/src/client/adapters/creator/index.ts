import { BaseBlock, BaseDiagramNode, Diagram, NodeID } from '@voiceflow/api-sdk';
import _isString from 'lodash/isString';

import { createSimpleAdapter } from '@/client/adapters/utils';
import { BlockType, PlatformType } from '@/constants';
import { FeatureFlagMap } from '@/ducks/feature';
import { CreatorDiagram, Link, Node, NodeData, Port } from '@/models';
import { denormalize, Normalized } from '@/utils/normalized';
import { getCurrentTimestamp } from '@/utils/time';
import { isDiagramReferencesBlockType, isMarkupBlockType } from '@/utils/typeGuards';

import { cleanupDBNodes } from './cleanup';
import nodeAdapter from './node';
import { isBlock } from './utils';

// we will be doing a patch request.
export type DBCreatorDiagram = Omit<Diagram, 'created' | 'creatorID' | 'variables' | 'versionID' | 'name'>;

const creatorAdapter = createSimpleAdapter<
  DBCreatorDiagram,
  CreatorDiagram,
  [
    {
      platform: PlatformType;
      features: FeatureFlagMap;
    }
  ],
  [
    {
      nodes: Normalized<Node>;
      ports: Normalized<Port>;
      platform: PlatformType;
      features: FeatureFlagMap;
    }
  ]
>(
  (diagram, { platform, features }) => {
    const rootNodeIDs: string[] = [];
    const nodes: Node[] = [];
    const nodeIDs = new Set<string>();

    const links: Link[] = [];

    const ports: Port[] = [];
    const portIDs = new Set<string>();

    const data: Record<string, NodeData<unknown>> = {};
    const markupNodeIDs: string[] = [];

    const nodeList = cleanupDBNodes(diagram.nodes);

    const parentNodes = nodeList.reduce<Record<string, BaseBlock>>((acc, node) => {
      if (isBlock(node)) {
        node.data.steps.forEach((stepID) => {
          acc[stepID] = node;
        });
      }
      return acc;
    }, {});

    const registerNode = (dbNode: BaseDiagramNode) => {
      const {
        node,
        data: nodeData,
        ports: nodePorts,
      } = nodeAdapter.fromDB(dbNode, {
        parentNode: parentNodes[dbNode.nodeID] || null,
        links,
        platform,
        features,
      });

      nodes.push(node);
      nodeIDs.add(node.id);
      data[node.id] = nodeData;
      nodePorts.forEach((port) => {
        ports.push(port);
        portIDs.add(port.id);
      });

      if (isMarkupBlockType(node.type)) {
        markupNodeIDs.push(node.id);
        return;
      }

      if (Array.isArray(dbNode.coords) && dbNode.coords.length === 2) {
        rootNodeIDs.push(node.id);
      }
    };

    nodeList.forEach(registerNode);

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
  ({ diagramID, viewport, links, data }, { nodes, ports, platform, features }) => {
    const nodeList = denormalize(nodes);

    const portToTargets = links.reduce<Record<string, NodeID>>((acc, link) => {
      if (link.source.portID in ports.byKey && link.target.nodeID in nodes.byKey) {
        acc[link.source.portID] = link.target.nodeID;
      }
      return acc;
    }, {});

    const sourcePortLinksMap = links.reduce<Record<string, Link>>((acc, link) => {
      if (link.source.portID in ports.byKey) {
        acc[link.source.portID] = link;
      }

      return acc;
    }, {});

    const stepMap = nodeList.reduce<Record<NodeID, NodeID>>((acc, node) => {
      if (node.combinedNodes) {
        for (let i = 1; i < node.combinedNodes.length; i++) {
          acc[node.combinedNodes[i - 1]] = node.combinedNodes[i];
        }
      }
      return acc;
    }, {});

    const diagram = {
      _id: diagramID,
      offsetX: viewport.x,
      offsetY: viewport.y,
      zoom: viewport.zoom,
      modified: getCurrentTimestamp(),
      nodes: nodeList.reduce<Record<string, BaseDiagramNode>>(
        (acc, node) => ({
          ...acc,
          [node.id]: nodeAdapter.toDB(
            {
              node,
              data: data[node.id],
              ports: node.ports.out.map((portID) => ports.byKey[portID]),
            },
            { portToTargets, stepMap, platform, portLinksMap: sourcePortLinksMap, features }
          ),
        }),
        {}
      ),
    };

    const children = [
      ...Object.values(diagram.nodes).reduce((acc, node) => {
        if (isDiagramReferencesBlockType(node.type as BlockType) && _isString(node.data?.diagramID)) {
          acc.add(node.data.diagramID);
        }

        return acc;
      }, new Set<string>()),
    ];

    return { ...diagram, children };
  }
);

export default creatorAdapter;
