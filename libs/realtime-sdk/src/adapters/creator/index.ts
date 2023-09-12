import { CreatorDiagram, DBNodeStart, Link, Node, NodeData, Port } from '@realtime-sdk/models';
import { isActions, isBlock, isMarkupBlockType, isStart } from '@realtime-sdk/utils/typeGuards';
import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config/backend';
import { createSimpleAdapter } from 'bidirectional-adapter';
import { denormalize, Normalized } from 'normal-store';

import { AdapterContext, VersionAdapterContext } from '../types';
import { cleanupDBNodes } from './cleanup';
import nodeAdapter from './node';

export { default as nodeAdapter } from './node';
export { default as nodeDataAdapter } from './nodeData';
export { default as stepPortsAdapter } from './stepPorts';

// we will be doing a patch request.
export type DBCreatorDiagram = Omit<BaseModels.Diagram.Model, 'created' | 'creatorID' | 'variables' | 'versionID' | 'name'>;

const creatorAdapter = createSimpleAdapter<
  DBCreatorDiagram,
  CreatorDiagram,
  [
    {
      platform: Platform.Constants.PlatformType;
      projectType: Platform.Constants.ProjectType;
      context: AdapterContext;
    }
  ],
  [
    {
      nodes: Normalized<Node>;
      ports: Normalized<Port>;
      platform: Platform.Constants.PlatformType;
      projectType: Platform.Constants.ProjectType;
      context: VersionAdapterContext;
      partial?: boolean;
    }
  ]
>(
  (diagram, { platform, projectType, context }) => {
    const nodes: Node[] = [];
    const nodeIDs = new Set<string>();

    const links: Link[] = [];

    const ports: Port[] = [];
    const portIDs = new Set<string>();

    const data: Record<string, NodeData<unknown>> = {};
    const rootNodeIDs: string[] = [];
    const markupNodeIDs: string[] = [];

    const nodeList = cleanupDBNodes(diagram.nodes);

    const parentNodes = nodeList.reduce<Record<string, BaseModels.BaseBlock | BaseModels.BaseActions | DBNodeStart>>((acc, node) => {
      if (isBlock(node) || isActions(node) || isStart(node)) {
        node.data.steps.forEach((id: string) => {
          acc[id] = node;
        });
      }

      return acc;
    }, {});

    const registerNode = (dbNode: BaseModels.BaseDiagramNode) => {
      const {
        node,
        data: nodeData,
        ports: nodePorts,
      } = nodeAdapter.fromDB(dbNode, {
        links,
        context,
        platform,
        parentNode: parentNodes[dbNode.nodeID] || null,
        projectType,
      });

      data[node.id] = nodeData;

      nodes.push(node);
      nodeIDs.add(node.id);
      nodePorts.forEach((port) => {
        ports.push(port);
        portIDs.add(port.id);
      });

      if (isMarkupBlockType(node.type)) {
        markupNodeIDs.push(node.id);
      } else if (Array.isArray(dbNode.coords) && dbNode.coords.length === 2) {
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
      data,
      ports,
      links: validLinks,
      nodes,
      viewport: { x: diagram.offsetX, y: diagram.offsetY, zoom: diagram.zoom },
      diagramID: diagram._id,
      rootNodeIDs,
      markupNodeIDs,
    };
  },
  ({ diagramID, viewport, links, data }, { nodes, ports, platform, projectType, context, partial }) => {
    const nodeList = denormalize(nodes);

    const portToTargets = links.reduce<Record<string, string>>((acc, link) => {
      if (link.source.portID in ports.byKey && (partial || link.target.nodeID in nodes.byKey)) {
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

    const dbNodes = nodeList.reduce<Record<string, BaseModels.BaseDiagramNode>>(
      (acc, node) => ({
        ...acc,
        [node.id]: nodeAdapter.toDB(
          {
            node,
            data: data[node.id],
            ports: [
              ...node.ports.out.dynamic.map((portID) => ports.byKey[portID]),
              ...[...Object.values(node.ports.out.byKey), ...Object.values(node.ports.out.builtIn)]
                .filter(Boolean)
                .map((portID) => ports.byKey[portID]),
            ],
          },
          { portToTargets, platform, projectType, portLinksMap: sourcePortLinksMap, context }
        ),
      }),
      {}
    );

    const diagram = {
      _id: diagramID,
      zoom: viewport.zoom,
      nodes: dbNodes,
      offsetX: viewport.x,
      offsetY: viewport.y,
      modified: Utils.time.getCurrentTimestamp(),
    };

    return { ...diagram };
  }
);

export default creatorAdapter;
