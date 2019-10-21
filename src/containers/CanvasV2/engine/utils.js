import cuid from 'cuid';

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
  const newID = getNodeID(node.id);

  return {
    node: {
      ...node,
      id: newID,
      parentNode: node.parentNode && getNodeID(node.parentNode),
      combinedNodes: node.combinedNodes.map(getNodeID),
      ports: {
        ...node.ports,
        in: node.ports.in.map(getPortID),
        out: node.ports.out.map(getPortID),
      },
    },
    data: {
      ...data,
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

export const cloneNodeGroup = ({ nodesWithData, ports, links }) => {
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
