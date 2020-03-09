import cuid from 'cuid';

import { BlockType } from '@/constants';
import * as Display from '@/ducks/display';
import * as Feature from '@/ducks/feature';
import { NODE_MANAGERS } from '@/pages/Canvas/managers';
import { asyncForEach } from '@/utils/array';

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

  isFeatureEnabled(featureID) {
    return this.select(Feature.isFeatureEnabledSelector)(featureID);
  }
}

export function nodeFactory(type) {
  const { factory } = NODE_MANAGERS[type];
  const { node, data } = factory?.() ?? { node: {}, data: {} };

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

export const cloneNodeWithData = ({ getNodeID, getPortID }, dispatch, skillID) => async ({ node, data }) => {
  let originNode = node;
  let originNodeData = data;

  const newID = getNodeID(originNode.id);

  if (originNode.type === BlockType.DISPLAY && originNodeData.displayID) {
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

export const cloneEntityMap = async ({ nodesWithData, ports, links }, dispatch, skillID) => {
  const context = createCloneContext();

  const clonedPorts = ports.map(clonePort(context));

  const clonedNodesWithData = [];

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

export const extractPoints = (canvas, start, end) => {
  const startY = start.top + start.height / 2;
  const endY = end.top + start.height / 2;

  return [canvas.transformPoint([start.right, startY]), canvas.transformPoint([end.left, endY])];
};
