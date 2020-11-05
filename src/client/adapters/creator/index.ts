import _isNumber from 'lodash/isNumber';

import { BlockType, MARKUP_NODES, PlatformType, ROOT_NODES } from '@/constants';
import { BlockVariant } from '@/constants/canvas';
import { CreatorDiagram, DBCreatorDiagram, DBNode, Node, NodeData, Port } from '@/models';
import { Normalized, getAllNormalizedByKeys } from '@/utils/normalized';

import { createSimpleAdapter } from '../utils';
import { APP_BLOCK_TYPE_FROM_DB, DB_BLOCK_TYPE_FROM_APP } from './block';
import linkAdapter from './link';
import nodeAdapter from './node';
import nodeDataAdapter from './nodeData';
import portAdapter from './port';
import { findDiagramCenter, getInvocationNodeID, getVirtualNodeID, getVirtualPortID, spreadOutNodes } from './utils';

const buildVirtualExtras = (node: DBNode, childNode: DBNode) => {
  const { color } = node.extras;
  const inPortID = node.ports?.[0].id;

  // TODO: extra convolution can hopefully be removed once database size constraints are removed / altered
  return {
    // ignore the default value
    color: color === BlockVariant.STANDARD ? undefined : color,
    // ignore redundant value
    name: node.name === childNode.name ? undefined : node.name,
    // ignore reproducable values
    id: node.id === getVirtualNodeID(childNode.id) ? undefined : node.id,
    inPortID: inPortID === getVirtualPortID(childNode.id) ? undefined : inPortID,
  };
};

const buildExtras = (node: DBNode, virtualExtras: DBNode.VirtualExtras) => {
  const hasVirtualExtras = (Object.keys(virtualExtras) as (keyof typeof virtualExtras)[]).some((key) => virtualExtras[key]);

  return {
    ...node.extras,
    virtualExtras: hasVirtualExtras ? virtualExtras : undefined,
  };
};

const creatorAdapter = createSimpleAdapter<
  DBCreatorDiagram,
  CreatorDiagram,
  [PlatformType],
  [
    {
      linksByPortID: Record<string, string[]>;
      platform: PlatformType;
      nodes: Normalized<Node>;
      ports: Normalized<Port>;
    }
  ]
>(
  (diagram, platform) => {
    const rootNodeIDs: string[] = [];
    const nodes: Node[] = [];
    const nodeIDs: string[] = [];
    const ports: Port[] = [];
    const portIDs: string[] = [];
    const data: Record<string, NodeData<unknown>> = {};
    const markupNodeIDs: string[] = [];

    const registerNode = (node: DBNode, parentNode?: string) => {
      const nodeData = nodeDataAdapter.fromDB(node.extras, node);

      nodeIDs.push(node.id);
      nodes.push(nodeAdapter.fromDB(node, nodeData, parentNode));
      node.ports
        .map((port) => portAdapter.fromDB(port, nodeData.type, platform))
        .forEach((port) => {
          ports.push(port);
          portIDs.push(port.id);
        });
      data[node.id] = nodeData;
    };

    let diagramNodes = diagram.nodes;

    // apply an offset to space out blocks from the old layout
    if (!diagram.blockRedesignOffset) {
      const nodesWithCoordinates = diagram.nodes.filter((node) => _isNumber(node.x) && _isNumber(node.y)) as DBNode.WithCoords[];
      const center = findDiagramCenter(nodesWithCoordinates);

      diagramNodes = spreadOutNodes(nodesWithCoordinates, center);
    }

    diagramNodes.forEach((node) => {
      const nodeType = APP_BLOCK_TYPE_FROM_DB[node.extras.type] || node.extras.type;

      if (MARKUP_NODES.includes(nodeType)) {
        markupNodeIDs.push(node.id);

        registerNode(node);

        return;
      }

      const { virtualExtras, ...extras } = node.extras || {};
      const virtualPortID = virtualExtras?.inPortID || getVirtualPortID(node.id);
      const virtualNodeID = virtualExtras?.id || getVirtualNodeID(node.id);
      let _node = node;

      if (nodeType === BlockType.COMBINED) {
        _node = {
          ...node,
          ports: virtualExtras?.reusePorts ? node.ports : [{ id: virtualPortID, parentNode: node.id, in: true, virtual: true }],
        };
      } else if (!ROOT_NODES.includes(nodeType)) {
        _node = {
          x: node.x,
          y: node.y,
          id: virtualNodeID,
          name: virtualExtras?.name || node.name || 'Block',
          extras: { type: DB_BLOCK_TYPE_FROM_APP[BlockType.COMBINED]!, ...virtualExtras },
          ports: [{ id: virtualExtras?.inPortID || virtualPortID, parentNode: virtualNodeID, in: true, virtual: true }],
          combines: [
            {
              ...node,
              extras,
              parentNode: virtualNodeID,
            },
          ],
        };
      }

      rootNodeIDs.push(_node.id);

      registerNode(_node);

      if (nodeType === BlockType.START) {
        registerNode(
          {
            x: node.x,
            y: node.y,
            id: getInvocationNodeID(node.id),
            name: 'Invocation',
            ports: node.ports,
            extras: { type: BlockType.INVOCATION },
            combines: null,
            parentNode: node.id,
          },
          _node.id
        );
      }

      if (_node.combines) {
        _node.combines.forEach((combinedNode) => registerNode(combinedNode, _node.id));
      }
    });

    const links = linkAdapter.mapFromDB(diagram.links);
    const validLinks = links.filter(
      (link) =>
        nodeIDs.includes(link.source.nodeID) &&
        nodeIDs.includes(link.target.nodeID) &&
        portIDs.includes(link.source.portID) &&
        portIDs.includes(link.target.portID)
    );

    return {
      diagramID: diagram.id,
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
  ({ diagramID, viewport, rootNodeIDs, links, data, markupNodeIDs }, { nodes, ports, linksByPortID, platform }) => {
    const rootNodes = getAllNormalizedByKeys(nodes, rootNodeIDs);
    const markupNodes = getAllNormalizedByKeys(nodes, markupNodeIDs);

    return {
      id: diagramID,
      offsetX: viewport.x,
      offsetY: viewport.y,
      zoom: viewport.zoom,
      links: linkAdapter.mapToDB(links, { nodes }),
      nodes: nodeAdapter.mapToDB([...rootNodes, ...markupNodes], { nodes, ports, data, linksByPortID, platform }).map((node) => {
        if (data[node.id].type !== BlockType.COMBINED || !node.combines?.length) {
          return node;
        }

        const childNode = node.combines![0];

        if (node.combines?.length > 1) {
          return {
            ...node,
            extras: buildExtras(node, { reusePorts: true }),
          };
        }

        const virtualExtras = buildVirtualExtras(node, childNode);

        return {
          ...childNode,
          name: childNode.name,
          parentNode: undefined,
          x: node.x,
          y: node.y,
          extras: buildExtras(childNode, virtualExtras),
        };
      }),
      blockRedesignOffset: true,
    };
  }
);

export default creatorAdapter;
