import cuid from 'cuid';

import { CanvasAPI } from '@/components/Canvas/types';
import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as Display from '@/ducks/display';
import { EntityMap, Link, NodeData, NodeWithData, Port } from '@/models';
import { getManager } from '@/pages/Canvas/managers';
import { NodeDescriptor } from '@/pages/Canvas/managers/types';
import { Dispatch, Dispatchable, Selector } from '@/store/types';
import { asyncForEach } from '@/utils/array';
import { isLinkedeDisplayNode } from '@/utils/node';

import type { Engine } from '.';

export type CloneUtils = {
  getNodeID: (nodeID: string) => string;
  getPortID: (portID: string) => string;
};

export class EngineConsumer {
  // eslint-disable-next-line no-useless-constructor
  constructor(protected engine: Engine) {}

  dispatch<T extends Dispatchable>(dispatchable: T) {
    return this.engine.store.dispatch<T>(dispatchable);
  }

  select<T>(selector: Selector<T>) {
    return this.engine.select(selector);
  }

  /**
   * clear any active data before a new diagram is being loaded
   */
  // eslint-disable-next-line class-methods-use-this
  reset() {
    // noop
  }

  /**
   * remove any subscriptions before the canvas is unmounted
   * reset() will be called before teardown()
   */
  // eslint-disable-next-line class-methods-use-this
  teardown() {
    // noop
  }
}

export function nodeFactory(
  type: BlockType,
  factoryData?: Partial<NodeData<unknown>>
): { node: Omit<Creator.NodeDescriptor, 'id'>; data: Creator.DataDescriptor } {
  const config = getManager(type);

  const {
    node: { ports, ...node },
    data,
  } = config?.factory?.(factoryData) ?? { node: {} as NodeDescriptor, data: {} as any };

  return {
    node: {
      ...Creator.Factories.nodeFactory(null, { ...node, type }),
      ports: {
        in: ((ports || {}).in || []).map((port) => ({ ...port, id: cuid() })),
        out: ((ports || {}).out || []).map((port) => ({ ...port, id: cuid() })),
      },
    },
    data,
  };
}

export const cloneLink = ({ getPortID, getNodeID }: CloneUtils) => (link: Link): Link => ({
  ...link,
  id: cuid(),
  source: {
    ...link.source,
    nodeID: getNodeID(link.source.nodeID),
    portID: getPortID(link.source.portID),
  },
  target: {
    ...link.target,
    nodeID: getNodeID(link.target.nodeID),
    portID: getPortID(link.target.portID),
  },
});

export const cloneNodeWithData = ({ getNodeID, getPortID }: CloneUtils, dispatch: Dispatch, skillID: string) => async ({
  node,
  data,
}: NodeWithData): Promise<NodeWithData> => {
  let originNode = node;
  let originNodeData: NodeData<any> = data;

  const newID = getNodeID(originNode.id);

  if (isLinkedeDisplayNode(originNodeData)) {
    const newDisplayID = await dispatch(Display.duplicateDisplay(originNodeData.displayID, skillID));
    originNodeData = { ...originNodeData, displayID: newDisplayID };
    originNode = { ...originNode, ports: originNode.ports };
  }

  return {
    node: {
      ...originNode,
      id: newID,
      parentNode: originNode.parentNode && getNodeID(originNode.parentNode),
      combinedNodes: originNode.combinedNodes.map(getNodeID),
      ports: {
        ...originNode.ports,
        in: originNode.ports.in.map(getPortID),
        out: originNode.ports.out.map(getPortID),
      },
    },
    data: {
      ...originNodeData,
      nodeID: newID,
    },
  };
};

export const clonePort = ({ getNodeID, getPortID }: CloneUtils) => (port: Port): Port => {
  const newID = getPortID(port.id);
  const nodeID = getNodeID(port.nodeID);

  return {
    ...port,
    id: newID,
    nodeID,
  };
};

const getOrCreateID = (lookup: Record<string, string>) => (id: string) => {
  if (lookup.hasOwnProperty(id)) {
    return lookup[id];
  }

  // eslint-disable-next-line no-return-assign
  return (lookup[id] = cuid());
};

export const createCloneContext = () => {
  const nodeIDLookup = {};
  const portIDLookup = {};

  return {
    getNodeID: getOrCreateID(nodeIDLookup),
    getPortID: getOrCreateID(portIDLookup),
  };
};

export const mergeEntityMaps = (lhs: EntityMap, rhs: EntityMap) => ({
  nodesWithData: [...lhs.nodesWithData, ...rhs.nodesWithData],
  ports: [...lhs.ports, ...rhs.ports],
  links: [...lhs.links, ...rhs.links],
});

export const cloneEntityMap = async ({ nodesWithData, ports, links }: EntityMap, dispatch: Dispatch, skillID: string) => {
  const context = createCloneContext();

  const clonedPorts = ports.map(clonePort(context));

  const clonedNodesWithData: NodeWithData[] = [];

  await asyncForEach(nodesWithData, async (nodeData) => {
    const clonedNodeData = await cloneNodeWithData(context, dispatch, skillID)(nodeData);
    clonedNodesWithData.push(clonedNodeData);
  });

  const clonedLinks = links.map(cloneLink(context));

  return {
    nodesWithData: clonedNodesWithData,
    ports: clonedPorts,
    links: clonedLinks,
  };
};

export const extractPoints = (canvas: CanvasAPI, start: DOMRect, end: DOMRect) => {
  const startY = start.top + start.height / 2;
  const endY = end.top + start.height / 2;

  return [canvas.transformPoint([start.right, startY]), canvas.transformPoint([end.left, endY])];
};
