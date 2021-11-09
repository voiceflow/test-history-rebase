import { Normalized, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockVariant } from '@/constants/canvas';
import { PartialModel } from '@/models';
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
  const getLink = (linkID: string) => Utils.normalized.getNormalizedByKey(state.links, linkID);
  const { union } = Utils.array.findUnion(getLinkIDs(lhsNodeID), getLinkIDs(rhsNodeID));

  return directional
    ? union.filter((linkID) => {
        const link = getLink(linkID);

        return link.source.nodeID === lhsNodeID && link.target.nodeID === rhsNodeID;
      })
    : union;
};

export const getOutgoingLinkIDs = (state: DiagramState, node: Realtime.Node) => node.ports.out.flatMap((portID) => getLinkIDsByPortID(state)(portID));

export const getIncomingLinkIDs = (state: DiagramState, node: Realtime.Node) => node.ports.in.flatMap((portID) => getLinkIDsByPortID(state)(portID));

export const getNestedOutgoingLinkIDs = (state: DiagramState, node: Realtime.Node) => {
  const { combinedNodes } = node;
  const lastNodeID = combinedNodes[combinedNodes.length - 1];
  const lastNode = Utils.normalized.getNormalizedByKey(state.nodes, lastNodeID);

  return getOutgoingLinkIDs(state, lastNode);
};

export const addReferenceByKey =
  <T>(key: string, referenceValue: T) =>
  (lookup: Record<string, T[]>) => ({
    ...lookup,
    [key]: Utils.normalized.safeAdd(lookup[key] || [], referenceValue),
  });

export const removeReferenceByKey =
  <T>(key: string, referenceValue: T) =>
  (lookup: Record<string, T[]>) =>
    key in lookup
      ? {
          ...lookup,
          [key]: Utils.array.withoutValue(lookup[key], referenceValue),
        }
      : lookup;

export const removePortFromNode = (node: Realtime.Node, portID: string) => ({
  ports: {
    ...node.ports,
    in: Utils.array.withoutValue(node.ports.in, portID),
    out: Utils.array.withoutValue(node.ports.out, portID),
  },
});

export const reorderNodePorts = (nodeID: string, from: number, to: number) => (state: DiagramState) => {
  const node = Utils.normalized.getNormalizedByKey(state.nodes, nodeID);

  return {
    ...state,
    nodes: Utils.normalized.patchNormalizedByKey(state.nodes, node.id, {
      ports: { ...node.ports, out: Utils.array.reorder(node.ports.out, from, to) },
    }),
  };
};

export const removePortFromNodes = (port: Realtime.Port) => (nodes: Normalized<Realtime.Node>) => {
  const node = Utils.normalized.getNormalizedByKey(nodes, port.nodeID);

  return Utils.normalized.patchNormalizedByKey(nodes, node.id, removePortFromNode(node, port.id));
};

export const addLinkToState = (link: Realtime.Link) => (state: DiagramState) => {
  const sourceNodeID = link.source.nodeID;
  const targetNodeID = link.target.nodeID;

  return {
    ...state,
    links: Utils.normalized.addNormalizedByKey(state.links, link.id, link),
    linksByPortID: Utils.functional.compose(
      addReferenceByKey(link.source.portID, link.id),
      addReferenceByKey(link.target.portID, link.id)
    )(state.linksByPortID),
    linksByNodeID: Utils.functional.compose(addReferenceByKey(sourceNodeID, link.id), addReferenceByKey(targetNodeID, link.id))(state.linksByNodeID),
    linkedNodesByNodeID: Utils.functional.compose(
      addReferenceByKey(sourceNodeID, targetNodeID),
      addReferenceByKey(targetNodeID, sourceNodeID)
    )(state.linkedNodesByNodeID),
  };
};

export const addAllLinksToState = (links: Realtime.Link[]) => Utils.functional.compose(...links.map(addLinkToState));

export const removeLinkFromState = (linkID: string) => (state: DiagramState) => {
  const link = Utils.normalized.getNormalizedByKey(state.links, linkID);

  // the link is already removed
  if (!link) {
    return state;
  }

  const sourceNodeID = link.source.nodeID;
  const targetNodeID = link.target.nodeID;

  return {
    ...state,
    links: Utils.normalized.removeNormalizedByKey(state.links, linkID),
    linksByPortID: Utils.functional.compose(
      removeReferenceByKey(link.source.portID, link.id),
      removeReferenceByKey(link.target.portID, link.id)
    )(state.linksByPortID),
    linksByNodeID: Utils.functional.compose(
      removeReferenceByKey(sourceNodeID, link.id),
      removeReferenceByKey(targetNodeID, link.id)
    )(state.linksByNodeID),
    linkedNodesByNodeID: Utils.functional.compose(
      removeReferenceByKey(sourceNodeID, targetNodeID),
      removeReferenceByKey(targetNodeID, sourceNodeID)
    )(state.linkedNodesByNodeID),
  };
};

export const removeAllLinksFromState = (linkIDs: string[]) => Utils.functional.compose(...linkIDs.map(removeLinkFromState));

export const removePortFromState = (portID: string) => (state: DiagramState) => ({
  ...state,
  ports: Utils.normalized.removeNormalizedByKey(state.ports, portID),
});

export const removeAllPortsFromState = (portIDs: string[]) => Utils.functional.compose(...portIDs.map(removePortFromState));

export const removePortFromBlockInState = (portID: string) =>
  Utils.functional.compose(removePortFromState(portID), (state: DiagramState) => {
    const port = Utils.normalized.getNormalizedByKey(state.ports, portID);
    const node = Utils.normalized.getNormalizedByKey(state.nodes, port.nodeID);

    return {
      ...state,
      nodes: Utils.normalized.patchNormalizedByKey(state.nodes, node.id, removePortFromNode(node, portID)),
    };
  });

export const removeAllPortsFromBlocksInState = (portIDs: string[]) => Utils.functional.compose(...portIDs.map(removePortFromBlockInState));

export const updateRootNodesInState = (nodeID: string, nodePatch: Partial<Realtime.Node>) => (state: DiagramState) =>
  !isMarkupBlockType(nodePatch.type ?? Utils.normalized.getNormalizedByKey(state.nodes, nodeID).type) && 'parentNode' in nodePatch
    ? {
        ...state,
        rootNodeIDs: nodePatch.parentNode ? Utils.array.withoutValue(state.rootNodeIDs, nodeID) : Utils.normalized.safeAdd(state.rootNodeIDs, nodeID),
      }
    : state;

export const addNodeToMarkupNodes = (nodeID: string, node: Realtime.Node) => (state: DiagramState) =>
  isMarkupBlockType(node.type)
    ? {
        ...state,
        markupNodeIDs: Utils.normalized.safeAdd(state.markupNodeIDs, nodeID),
      }
    : state;

export const updateNodeInState = (node: Realtime.Node) =>
  Utils.functional.compose(updateRootNodesInState(node.id, node), (state: DiagramState) => ({
    ...state,
    nodes: Utils.normalized.updateNormalizedByKey(state.nodes, node.id, node),
  }));

export const patchNodeInState = (nodeID: string, nodePatch: Partial<Realtime.Node>) =>
  Utils.functional.compose(updateRootNodesInState(nodeID, nodePatch), (state: DiagramState) => ({
    ...state,
    nodes: Utils.normalized.patchNormalizedByKey(state.nodes, nodeID, nodePatch),
  }));

export const addNode = (node: Realtime.Node, data: Realtime.NodeData<unknown>) => (state: DiagramState) => ({
  ...state,
  nodes: Utils.normalized.addNormalizedByKey(state.nodes, node.id, node),
  data: {
    ...state.data,
    [node.id]: data,
  },
});

export const addNodeToState = (node: Realtime.Node, data: Realtime.NodeData<unknown>) =>
  Utils.functional.compose(updateRootNodesInState(node.id, node), addNodeToMarkupNodes(node.id, node), addNode(node, data));

export const addAllNodesToState = (nodesWithData: { node: Realtime.Node; data: Realtime.NodeData<unknown> }[]) =>
  Utils.functional.compose(...nodesWithData.map(({ node, data }) => addNodeToState(node, data)));

export const removeNodeFromState = (node: Realtime.Node) => (state: DiagramState) => {
  const { [node.id]: data, ...dataWithoutNode } = state.data;

  return {
    ...state,
    nodes: Utils.normalized.removeNormalizedByKey(state.nodes, node.id),
    rootNodeIDs: Utils.array.withoutValue(state.rootNodeIDs, node.id),
    markupNodeIDs: Utils.array.withoutValue(state.markupNodeIDs, node.id),
    data: dataWithoutNode,
  };
};

export const removeBlockFromState = (node: Realtime.Node) => (state: DiagramState) =>
  Utils.functional.compose(
    removeAllLinksFromState(getLinkIDsByNodeID(state)(node.id)),
    removeAllPortsFromState([...node.ports.in, ...node.ports.out]),
    removeNodeFromState(node)
  )(state);

export const removeAllBlocksFromState = (nodes: Realtime.Node[]) => Utils.functional.compose(...nodes.map(removeBlockFromState));

export const addPortToState = (port: Realtime.Port) => (state: DiagramState) => ({
  ...state,
  ports: Utils.normalized.addNormalizedByKey(state.ports, port.id, port),
});

export const addAllPortsToState = (ports: Realtime.Port[]) => Utils.functional.compose(...ports.map(addPortToState));

export const addBlockToState = (node: Realtime.Node, ports: Realtime.Port[], data: Realtime.NodeData<unknown>) =>
  Utils.functional.compose(addNodeToState(node, data), addAllPortsToState(ports));

export const addPortToBlockInState =
  (port: Realtime.Port) =>
  (state: DiagramState): DiagramState => {
    const node = Utils.normalized.getNormalizedByKey(state.nodes, port.nodeID);

    return Utils.functional.compose(
      patchNodeInState(port.nodeID, { ports: { ...node.ports, out: [...node.ports.out, port.id] } }),
      addPortToState(port)
    )(state);
  };

export const patchPortInState =
  (portID: string, portPatch: Partial<Realtime.Port>) =>
  (state: DiagramState): DiagramState => ({
    ...state,
    ports: Utils.normalized.patchNormalizedByKey(state.ports, portID, portPatch),
  });

export const patchLinkInState =
  (linkID: string, linkPatch: Partial<Realtime.Link>) =>
  (state: DiagramState): DiagramState => ({
    ...state,
    links: Utils.normalized.patchNormalizedByKey(state.links, linkID, linkPatch),
  });

export const updateLinkPort = (link: Realtime.Link, relationship: 'source' | 'target', nodeID: string, portID: string): Realtime.Link => ({
  ...link,
  [relationship]: {
    nodeID,
    portID,
  },
});

export const buildLinksByPortID = (links: Realtime.Link[]): DiagramState['linksByPortID'] =>
  links.reduce<DiagramState['linksByPortID']>((acc, link) => {
    const sourcePortID = link.source.portID;
    const targetPortID = link.target.portID;
    acc[sourcePortID] = [...(acc[sourcePortID] || []), link.id];
    acc[targetPortID] = [...(acc[targetPortID] || []), link.id];

    return acc;
  }, {});

export const buildLinkedNodesByNodeID = (links: Realtime.Link[]): DiagramState['linkedNodesByNodeID'] =>
  links.reduce<DiagramState['linkedNodesByNodeID']>((acc, link) => {
    const sourceNodeID = link.source.nodeID;
    const targetNodeID = link.target.nodeID;
    acc[sourceNodeID] = [...(acc[sourceNodeID] || []), targetNodeID];
    acc[targetNodeID] = [...(acc[targetNodeID] || []), sourceNodeID];

    return acc;
  }, {});

export const buildLinksByNodeID = (links: Realtime.Link[]): DiagramState['linksByNodeID'] =>
  links.reduce<DiagramState['linksByNodeID']>((acc, link) => {
    const sourceNodeID = link.source.nodeID;
    const targetNodeID = link.target.nodeID;
    acc[sourceNodeID] = [...(acc[sourceNodeID] || []), link.id];
    acc[targetNodeID] = [...(acc[targetNodeID] || []), link.id];

    return acc;
  }, {});

export const buildPortForNode = (nodeID: string) => (port: PartialModel<Realtime.Port>) => portFactory(nodeID, port.id, port);

export const buildNewNode = (node: NodeDescriptor, data: DataDescriptor): [Realtime.Node, Realtime.Port[], Realtime.NodeData<unknown>] => {
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
