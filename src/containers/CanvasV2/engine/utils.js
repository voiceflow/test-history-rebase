import cuid from 'cuid';

import { BlockType } from '@/constants';
import { NODE_MANAGERS } from '@/containers/CanvasV2/managers';

export class EngineConsumer {
  constructor(engine) {
    this.engine = engine;
  }

  dispatch(action) {
    return this.engine.store.dispatch(action);
  }

  select(selector) {
    return selector(this.engine.store.getState());
  }
}

export function nodeFactory(type) {
  const { factory } = NODE_MANAGERS[type];
  const { node, data } = factory();

  return {
    node: {
      ...node,
      type,
      ports: {
        in: ((node.ports || {}).in || []).map((port) => ({ ...port, id: cuid() })),
        out: ((node.ports || {}).out || []).map((port) => ({ ...port, id: cuid() })),
      },
    },
    data,
  };
}

export const cloneLink = ({ getPortID, getNodeID }) => (link) => ({
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

export const cloneNodeWithData = ({ getNodeID, getPortID }) => ({ node, data }) => {
  let originNode = node;
  let originNodeData = data;

  const newID = getNodeID(originNode.id);

  // Some blocks (ex. display) point to redux for some of it's data, for UX purposes, in some cases we want to just create a fresh node
  if (originNode.type === BlockType.DISPLAY) {
    const emptyBlockData = NODE_MANAGERS[originNode.type].factory();
    originNodeData = { ...originNodeData, ...emptyBlockData.data };
    originNode = { ...originNode, ...emptyBlockData.node, ports: originNode.ports };
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

export const clonePort = ({ getNodeID, getPortID }) => (port) => {
  const newID = getPortID(port.id);
  const nodeID = getNodeID(port.nodeID);

  return {
    ...port,
    id: newID,
    nodeID,
  };
};

const getOrCreateID = (lookup) => (id) => {
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

export const mergeEntityMaps = (lhs, rhs) => ({
  nodesWithData: [...lhs.nodesWithData, ...rhs.nodesWithData],
  ports: [...lhs.ports, ...rhs.ports],
  links: [...lhs.links, ...rhs.links],
});

export const cloneEntityMap = ({ nodesWithData, ports, links }) => {
  const context = createCloneContext();

  const clonedPorts = ports.map(clonePort(context));

  const clonedNodesWithData = nodesWithData.map(cloneNodeWithData(context));

  const clonedLinks = links.map(cloneLink(context));

  return {
    nodesWithData: clonedNodesWithData,
    ports: clonedPorts,
    links: clonedLinks,
  };
};

export const extractPoints = (canvas, start, end) => {
  const startY = start.top + start.height / 2;
  const endY = end.top + start.height / 2;

  return [canvas.transformPoint([start.right, startY]), canvas.transformPoint([end.left, endY])];
};
