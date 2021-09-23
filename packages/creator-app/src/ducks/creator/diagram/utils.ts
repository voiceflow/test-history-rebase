import { BlockVariant } from '@/constants/canvas';
import { Link, Node, NodeData, PartialModel, Port } from '@/models';
import { findUnion, reorder, withoutValue } from '@/utils/array';
import { compose } from '@/utils/functional';
import {
  addNormalizedByKey,
  getNormalizedByKey,
  Normalized,
  patchNormalizedByKey,
  removeNormalizedByKey,
  safeAdd,
  updateNormalizedByKey,
} from '@/utils/normalized';
import { isMarkupBlockType } from '@/utils/typeGuards';

import { nodeFactory, portFactory } from './factories';
import { DataDescriptor, DiagramState, NodeDescriptor } from './types';

const EMPTY_ARRAY: any[] = [];

export const getLinkIDsByPortID =
  ({ linksByPortID }: DiagramState) =>
  (portID: string) =>
    linksByPortID[portID] || EMPTY_ARRAY;

export const getLinkIDsByNodeID =
  ({ linksByNodeID }: DiagramState) =>
  (nodeID: string) =>
    linksByNodeID[nodeID] || EMPTY_ARRAY;

export const getLinkedNodeIDsByNodeID =
  ({ linkedNodesByNodeID }: DiagramState) =>
  (nodeID: string) =>
    linkedNodesByNodeID[nodeID] || EMPTY_ARRAY;

export const getJoiningLinkIDs = (state: DiagramState) => (lhsNodeID: string, rhsNodeID: string, directional?: boolean) => {
  const getLinkIDs = getLinkIDsByNodeID(state);
  const getLink = (linkID: string) => getNormalizedByKey(state.links, linkID);
  const { union } = findUnion(getLinkIDs(lhsNodeID), getLinkIDs(rhsNodeID));

  return directional
    ? union.filter((linkID) => {
        const link = getLink(linkID);

        return link.source.nodeID === lhsNodeID && link.target.nodeID === rhsNodeID;
      })
    : union;
};

export const getOutgoingLinkIDs = (state: DiagramState, node: Node) => node.ports.out.flatMap((portID) => getLinkIDsByPortID(state)(portID));

export const getIncomingLinkIDs = (state: DiagramState, node: Node) => node.ports.in.flatMap((portID) => getLinkIDsByPortID(state)(portID));

export const getNestedOutgoingLinkIDs = (state: DiagramState, node: Node) => {
  const { combinedNodes } = node;
  const lastNodeID = combinedNodes[combinedNodes.length - 1];
  const lastNode = getNormalizedByKey(state.nodes, lastNodeID);

  return getOutgoingLinkIDs(state, lastNode);
};

export const addReferenceByKey =
  <T>(key: string, referenceValue: T) =>
  (lookup: Record<string, T[]>) => ({
    ...lookup,
    [key]: safeAdd(lookup[key] || [], referenceValue),
  });

export const removeReferenceByKey =
  <T>(key: string, referenceValue: T) =>
  (lookup: Record<string, T[]>) =>
    key in lookup
      ? {
          ...lookup,
          [key]: withoutValue(lookup[key], referenceValue),
        }
      : lookup;

export const removePortFromNode = (node: Node, portID: string) => ({
  ports: {
    ...node.ports,
    in: withoutValue(node.ports.in, portID),
    out: withoutValue(node.ports.out, portID),
  },
});

export const reorderNodePorts = (nodeID: string, from: number, to: number) => (state: DiagramState) => {
  const node = getNormalizedByKey(state.nodes, nodeID);

  return {
    ...state,
    nodes: patchNormalizedByKey(state.nodes, node.id, { ports: { ...node.ports, out: reorder(node.ports.out, from, to) } }),
  };
};

export const removePortFromNodes = (port: Port) => (nodes: Normalized<Node>) => {
  const node = getNormalizedByKey(nodes, port.nodeID);

  return patchNormalizedByKey(nodes, node.id, removePortFromNode(node, port.id));
};

export const addLinkToState = (link: Link) => (state: DiagramState) => {
  const sourceNodeID = link.source.nodeID;
  const targetNodeID = link.target.nodeID;

  return {
    ...state,
    links: addNormalizedByKey(state.links, link.id, link),
    linksByPortID: compose(addReferenceByKey(link.source.portID, link.id), addReferenceByKey(link.target.portID, link.id))(state.linksByPortID),
    linksByNodeID: compose(addReferenceByKey(sourceNodeID, link.id), addReferenceByKey(targetNodeID, link.id))(state.linksByNodeID),
    linkedNodesByNodeID: compose(
      addReferenceByKey(sourceNodeID, targetNodeID),
      addReferenceByKey(targetNodeID, sourceNodeID)
    )(state.linkedNodesByNodeID),
  };
};

export const addAllLinksToState = (links: Link[]) => compose(...links.map(addLinkToState));

export const removeLinkFromState = (linkID: string) => (state: DiagramState) => {
  const link = getNormalizedByKey(state.links, linkID);

  // the link is already removed
  if (!link) {
    return state;
  }

  const sourceNodeID = link.source.nodeID;
  const targetNodeID = link.target.nodeID;

  return {
    ...state,
    links: removeNormalizedByKey(state.links, linkID),
    linksByPortID: compose(removeReferenceByKey(link.source.portID, link.id), removeReferenceByKey(link.target.portID, link.id))(state.linksByPortID),
    linksByNodeID: compose(removeReferenceByKey(sourceNodeID, link.id), removeReferenceByKey(targetNodeID, link.id))(state.linksByNodeID),
    linkedNodesByNodeID: compose(
      removeReferenceByKey(sourceNodeID, targetNodeID),
      removeReferenceByKey(targetNodeID, sourceNodeID)
    )(state.linkedNodesByNodeID),
  };
};

export const removeAllLinksFromState = (linkIDs: string[]) => compose(...linkIDs.map(removeLinkFromState));

export const removePortFromState = (portID: string) => (state: DiagramState) => ({
  ...state,
  ports: removeNormalizedByKey(state.ports, portID),
});

export const removeAllPortsFromState = (portIDs: string[]) => compose(...portIDs.map(removePortFromState));

export const removePortFromBlockInState = (portID: string) =>
  compose(removePortFromState(portID), (state: DiagramState) => {
    const port = getNormalizedByKey(state.ports, portID);
    const node = getNormalizedByKey(state.nodes, port.nodeID);

    return {
      ...state,
      nodes: patchNormalizedByKey(state.nodes, node.id, removePortFromNode(node, portID)),
    };
  });

export const removeAllPortsFromBlocksInState = (portIDs: string[]) => compose(...portIDs.map(removePortFromBlockInState));

export const updateRootNodesInState = (nodeID: string, nodePatch: Partial<Node>) => (state: DiagramState) =>
  !isMarkupBlockType(nodePatch.type ?? getNormalizedByKey(state.nodes, nodeID).type) && 'parentNode' in nodePatch
    ? {
        ...state,
        rootNodeIDs: nodePatch.parentNode ? withoutValue(state.rootNodeIDs, nodeID) : safeAdd(state.rootNodeIDs, nodeID),
      }
    : state;

export const addNodeToMarkupNodes = (nodeID: string, node: Node) => (state: DiagramState) =>
  isMarkupBlockType(node.type)
    ? {
        ...state,
        markupNodeIDs: safeAdd(state.markupNodeIDs, nodeID),
      }
    : state;

export const updateNodeInState = (node: Node) =>
  compose(updateRootNodesInState(node.id, node), (state: DiagramState) => ({
    ...state,
    nodes: updateNormalizedByKey(state.nodes, node.id, node),
  }));

export const patchNodeInState = (nodeID: string, nodePatch: Partial<Node>) =>
  compose(updateRootNodesInState(nodeID, nodePatch), (state: DiagramState) => ({
    ...state,
    nodes: patchNormalizedByKey(state.nodes, nodeID, nodePatch),
  }));

export const addNode = (node: Node, data: NodeData<unknown>) => (state: DiagramState) => ({
  ...state,
  nodes: addNormalizedByKey(state.nodes, node.id, node),
  data: {
    ...state.data,
    [node.id]: data,
  },
});

export const addNodeToState = (node: Node, data: NodeData<unknown>) =>
  compose(updateRootNodesInState(node.id, node), addNodeToMarkupNodes(node.id, node), addNode(node, data));

export const addAllNodesToState = (nodesWithData: { node: Node; data: NodeData<unknown> }[]) =>
  compose(...nodesWithData.map(({ node, data }) => addNodeToState(node, data)));

export const removeNodeFromState = (node: Node) => (state: DiagramState) => {
  const { [node.id]: data, ...dataWithoutNode } = state.data;

  return {
    ...state,
    nodes: removeNormalizedByKey(state.nodes, node.id),
    rootNodeIDs: withoutValue(state.rootNodeIDs, node.id),
    markupNodeIDs: withoutValue(state.markupNodeIDs, node.id),
    data: dataWithoutNode,
  };
};

export const removeBlockFromState = (node: Node) => (state: DiagramState) =>
  compose(
    removeAllLinksFromState(getLinkIDsByNodeID(state)(node.id)),
    removeAllPortsFromState([...node.ports.in, ...node.ports.out]),
    removeNodeFromState(node)
  )(state);

export const removeAllBlocksFromState = (nodes: Node[]) => compose(...nodes.map(removeBlockFromState));

export const addPortToState = (port: Port) => (state: DiagramState) => ({
  ...state,
  ports: addNormalizedByKey(state.ports, port.id, port),
});

export const addAllPortsToState = (ports: Port[]) => compose(...ports.map(addPortToState));

export const addBlockToState = (node: Node, ports: Port[], data: NodeData<unknown>) => compose(addNodeToState(node, data), addAllPortsToState(ports));

export const addPortToBlockInState =
  (port: Port) =>
  (state: DiagramState): DiagramState => {
    const node = getNormalizedByKey(state.nodes, port.nodeID);

    return compose(patchNodeInState(port.nodeID, { ports: { ...node.ports, out: [...node.ports.out, port.id] } }), addPortToState(port))(state);
  };

export const patchPortInState =
  (portID: string, portPatch: Partial<Port>) =>
  (state: DiagramState): DiagramState => ({
    ...state,
    ports: patchNormalizedByKey(state.ports, portID, portPatch),
  });

export const patchLinkInState =
  (linkID: string, linkPatch: Partial<Link>) =>
  (state: DiagramState): DiagramState => ({
    ...state,
    links: patchNormalizedByKey(state.links, linkID, linkPatch),
  });

export const updateLinkPort = (link: Link, relationship: 'source' | 'target', nodeID: string, portID: string): Link => ({
  ...link,
  [relationship]: {
    nodeID,
    portID,
  },
});

export const buildLinksByPortID = (links: Link[]): DiagramState['linksByPortID'] =>
  links.reduce<DiagramState['linksByPortID']>((acc, link) => {
    const sourcePortID = link.source.portID;
    const targetPortID = link.target.portID;
    acc[sourcePortID] = [...(acc[sourcePortID] || []), link.id];
    acc[targetPortID] = [...(acc[targetPortID] || []), link.id];

    return acc;
  }, {});

export const buildLinkedNodesByNodeID = (links: Link[]): DiagramState['linkedNodesByNodeID'] =>
  links.reduce<DiagramState['linkedNodesByNodeID']>((acc, link) => {
    const sourceNodeID = link.source.nodeID;
    const targetNodeID = link.target.nodeID;
    acc[sourceNodeID] = [...(acc[sourceNodeID] || []), targetNodeID];
    acc[targetNodeID] = [...(acc[targetNodeID] || []), sourceNodeID];

    return acc;
  }, {});

export const buildLinksByNodeID = (links: Link[]): DiagramState['linksByNodeID'] =>
  links.reduce<DiagramState['linksByNodeID']>((acc, link) => {
    const sourceNodeID = link.source.nodeID;
    const targetNodeID = link.target.nodeID;
    acc[sourceNodeID] = [...(acc[sourceNodeID] || []), link.id];
    acc[targetNodeID] = [...(acc[targetNodeID] || []), link.id];

    return acc;
  }, {});

export const buildPortForNode = (nodeID: string) => (port: PartialModel<Port>) => portFactory(nodeID, port.id, port);

export const buildNewNode = (node: NodeDescriptor, data: DataDescriptor): [Node, Port[], NodeData<unknown>] => {
  const inPorts = node.ports.in.map(buildPortForNode(node.id));
  const outPorts = node.ports.out.map(buildPortForNode(node.id));

  const newNodeData = {
    ...data,
    nodeID: node.id,
    type: node.type,
    blockColor: BlockVariant.STANDARD,
    path: [],
  };
  const newNode = nodeFactory(node.id, {
    ...node,
    ports: {
      in: inPorts.map((port) => port.id),
      out: outPorts.map((port) => port.id),
    },
  });

  return [newNode, [...inPorts, ...outPorts], newNodeData];
};
