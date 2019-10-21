import cuid from 'cuid';

import { withoutValue } from '@/utils/array';
import { compose } from '@/utils/functional';
import {
  addNormalizedByKey,
  getAllNormalizedByKeys,
  getNormalizedByKey,
  patchNormalizedByKey,
  removeNormalizedByKey,
  safeAdd,
  updateNormalizedByKey,
} from '@/utils/normalized';

export const getLinkIDsByPortID = ({ linksByPortID }) => (portID) => linksByPortID[portID] || [];

export const getLinkIDsByNodeID = ({ linksByNodeID }) => (nodeID) => linksByNodeID[nodeID] || [];

export const getLinkedNodeIDsByNodeID = ({ linkedNodesByNodeID }) => (nodeID) => linkedNodesByNodeID[nodeID] || [];

export const addReferenceByKey = (key, referenceValue) => (lookup) => ({
  ...lookup,
  [key]: safeAdd(lookup[key] || [], referenceValue),
});

export const removeReferenceByKey = (key, referenceValue) => (lookup) =>
  key in lookup
    ? {
        ...lookup,
        [key]: withoutValue(lookup[key], referenceValue),
      }
    : lookup;

export const removePortFromNode = (node, portID) => ({
  ports: {
    ...node.ports,
    in: withoutValue(node.ports.in, portID),
    out: withoutValue(node.ports.out, portID),
  },
});

export const removePortFromNodes = (port) => (nodes) => {
  const node = getNormalizedByKey(nodes, port.nodeID);

  return patchNormalizedByKey(nodes, node.id, removePortFromNode(node, port.id));
};

export const addLinkToState = (link) => (state) => {
  const sourceNodeID = link.source.nodeID;
  const targetNodeID = link.target.nodeID;

  return {
    ...state,
    links: addNormalizedByKey(state.links, link.id, link),
    linksByPortID: compose(
      addReferenceByKey(link.source.portID, link.id),
      addReferenceByKey(link.target.portID, link.id)
    )(state.linksByPortID),
    linksByNodeID: compose(
      addReferenceByKey(sourceNodeID, link.id),
      addReferenceByKey(targetNodeID, link.id)
    )(state.linksByNodeID),
    linkedNodesByNodeID: compose(
      addReferenceByKey(sourceNodeID, targetNodeID),
      addReferenceByKey(targetNodeID, sourceNodeID)
    )(state.linkedNodesByNodeID),
  };
};

export const addAllLinksToState = (links) => compose(...links.map(addLinkToState));

export const removeLinkFromState = (linkID) => (state) => {
  const link = getNormalizedByKey(state.links, linkID);
  const sourceNodeID = link.source.nodeID;
  const targetNodeID = link.target.nodeID;

  return {
    ...state,
    links: removeNormalizedByKey(state.links, linkID),
    linksByPortID: compose(
      removeReferenceByKey(link.source.portID, link.id),
      removeReferenceByKey(link.target.portID, link.id)
    )(state.linksByPortID),
    linksByNodeID: compose(
      removeReferenceByKey(sourceNodeID, link.id),
      removeReferenceByKey(targetNodeID, link.id)
    )(state.linksByNodeID),
    linkedNodesByNodeID: compose(
      removeReferenceByKey(sourceNodeID, targetNodeID),
      removeReferenceByKey(targetNodeID, sourceNodeID)
    )(state.linkedNodesByNodeID),
  };
};

export const removeAllLinksFromState = (linkIDs) => compose(...linkIDs.map(removeLinkFromState));

export const removePortFromState = (portID) => (state) => ({
  ...state,
  ports: removeNormalizedByKey(state.ports, portID),
});

export const removeAllPortsFromState = (portIDs) => compose(...portIDs.map(removePortFromState));

export const removePortFromBlockInState = (portID) =>
  compose(
    removePortFromState(portID),
    (state) => {
      const port = getNormalizedByKey(state.ports, portID);
      const node = getNormalizedByKey(state.nodes, port.nodeID);

      return {
        ...state,
        nodes: patchNormalizedByKey(state.nodes, node.id, removePortFromNode(node, portID)),
      };
    }
  );

export const removeAllPortsFromBlocksInState = (portIDs) => compose(...portIDs.map(removePortFromBlockInState));

export const updateRootNodesInState = (nodeID, nodePatch) => (state) => ({
  ...state,
  ...('parentNode' in nodePatch && {
    rootNodes: nodePatch.parentNode ? withoutValue(state.rootNodes, nodeID) : safeAdd(state.rootNodes, nodeID),
  }),
});

export const updateNodeInState = (node) =>
  compose(
    updateRootNodesInState(node.id, node),
    (state) => ({
      ...state,
      nodes: updateNormalizedByKey(state.nodes, node.id, node),
    })
  );

export const patchNodeInState = (nodeID, nodePatch) =>
  compose(
    updateRootNodesInState(nodeID, nodePatch),
    (state) => ({
      ...state,
      nodes: patchNormalizedByKey(state.nodes, nodeID, nodePatch),
    })
  );

export const clonePortForNode = (nodeID) => (port) => ({
  ...port,
  id: cuid(),
  nodeID,
});

export const clonePortsForNode = (ports, targetID, sourcePorts) => getAllNormalizedByKeys(ports, sourcePorts).map(clonePortForNode(targetID));

export const addNodeToState = (node, data) =>
  compose(
    updateRootNodesInState(node.id, node),
    (state) => ({
      ...state,
      nodes: addNormalizedByKey(state.nodes, node.id, node),
      data: {
        ...state.data,
        [node.id]: data,
      },
    })
  );

export const addAllNodesToState = (nodesWithData) => compose(...nodesWithData.map(({ node, data }) => addNodeToState(node, data)));

export const removeNodeFromState = (node) => (state) => {
  const { [node.id]: data, ...dataWithoutNode } = state.data;

  return {
    ...state,
    nodes: removeNormalizedByKey(state.nodes, node.id),
    rootNodes: withoutValue(state.rootNodes, node.id),
    data: dataWithoutNode,
  };
};

export const removeBlockFromState = (node) => (state) =>
  compose(
    removeAllLinksFromState(getLinkIDsByNodeID(state)(node.id)),
    removeAllPortsFromState([...node.ports.in, ...node.ports.out]),
    removeNodeFromState(node)
  )(state);

export const removeAllBlocksFromState = (nodes) => compose(...nodes.map(removeBlockFromState));

export const addPortToState = (port) => (state) => ({
  ...state,
  ports: addNormalizedByKey(state.ports, port.id, port),
});

export const addAllPortsToState = (ports) => compose(...ports.map(addPortToState));

export const addBlockToState = (node, ports, data) =>
  compose(
    addNodeToState(node, data),
    addAllPortsToState(ports)
  );

export const addPortToBlockInState = (port) => (state) => {
  const node = getNormalizedByKey(state.nodes, port.nodeID);

  return compose(
    patchNodeInState(port.nodeID, { ports: { ...node.ports, out: [...node.ports.out, port.id] } }),
    addPortToState(port)
  )(state);
};

export const updateLinkPort = (link, relationship, nodeID, portID) => ({
  ...link,
  [relationship]: {
    nodeID,
    portID,
  },
});

export const remapExistingLinksToPort = (state, oldPortID, newPortID, newNodeID) =>
  getAllNormalizedByKeys(state.links, getLinkIDsByPortID(state)(oldPortID)).map((link) =>
    updateLinkPort(link, link.source.portID === oldPortID ? 'source' : 'target', newNodeID, newPortID)
  );

export const buildLinksByPortID = (links) =>
  links.reduce((acc, link) => {
    const sourcePortID = link.source.portID;
    const targetPortID = link.target.portID;
    acc[sourcePortID] = [...(acc[sourcePortID] || []), link.id];
    acc[targetPortID] = [...(acc[targetPortID] || []), link.id];

    return acc;
  }, {});

export const buildLinkedNodesByNodeID = (links) =>
  links.reduce((acc, link) => {
    const sourceNodeID = link.source.nodeID;
    const targetNodeID = link.target.nodeID;
    acc[sourceNodeID] = [...(acc[sourceNodeID] || []), targetNodeID];
    acc[targetNodeID] = [...(acc[targetNodeID] || []), sourceNodeID];

    return acc;
  }, {});

export const buildLinksByNodeID = (links) =>
  links.reduce((acc, link) => {
    const sourceNodeID = link.source.nodeID;
    const targetNodeID = link.target.nodeID;
    acc[sourceNodeID] = [...(acc[sourceNodeID] || []), link.id];
    acc[targetNodeID] = [...(acc[targetNodeID] || []), link.id];

    return acc;
  }, {});
