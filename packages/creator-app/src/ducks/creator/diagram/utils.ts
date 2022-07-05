import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { COLOR_PICKER_CONSTANTS } from '@voiceflow/ui';
import _groupBy from 'lodash/groupBy';
import * as Normal from 'normal-store';

import { isMarkupBlockType } from '@/utils/typeGuards';

import { nodeFactory, portFactory } from './factories';
import { DataDescriptor, DiagramState, NodeDescriptor } from './types';

type DiagramStateComposeReducer = (state: DiagramState) => DiagramState;

const EMPTY_ARRAY: any[] = [];

export const getLinkIDsByPortID =
  ({ linksByPortID }: DiagramState) =>
  (portID: string): string[] =>
    linksByPortID[portID] || EMPTY_ARRAY;

export const getLinkIDsByNodeID =
  ({ linksByNodeID }: DiagramState) =>
  (nodeID: string): string[] =>
    linksByNodeID[nodeID] || EMPTY_ARRAY;

export const getLinkedNodeIDsByNodeID =
  ({ linkedNodesByNodeID }: DiagramState) =>
  (nodeID: string): string[] =>
    linkedNodesByNodeID[nodeID] || EMPTY_ARRAY;

export const getJoiningLinkIDs =
  (state: DiagramState) =>
  (lhsNodeID: string, rhsNodeID: string, directional?: boolean): string[] => {
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

export const getOutgoingLinkIDs = (state: DiagramState, node: Realtime.Node, options?: { skipByKeyLinks?: boolean }): string[] =>
  Realtime.Utils.port
    .flattenOutPorts(node.ports, { skipByKeyPorts: !!options?.skipByKeyLinks })
    .flatMap((portID) => getLinkIDsByPortID(state)(portID));

export const getIncomingLinkIDs = (state: DiagramState, node: Realtime.Node): string[] =>
  node.ports.in.flatMap((portID) => getLinkIDsByPortID(state)(portID));

export const getNestedOutgoingLinkIDs = (state: DiagramState, node: Realtime.Node, options?: { skipByKeyLinks?: boolean }): string[] => {
  const { combinedNodes } = node;
  const lastNodeID = combinedNodes[combinedNodes.length - 1];
  const lastNode = Utils.normalized.getNormalizedByKey(state.nodes, lastNodeID);

  return getOutgoingLinkIDs(state, lastNode, options);
};

export const addReferenceByKey =
  <T>(key: string, referenceValue: T) =>
  (lookup: Record<string, T[]>): Record<string, T[]> => ({
    ...lookup,
    [key]: Utils.normalized.safeAdd(lookup[key] || [], referenceValue),
  });

export const removeReferenceByKey =
  <T>(key: string, referenceValue: T) =>
  (lookup: Record<string, T[]>): Record<string, T[]> =>
    key in lookup
      ? {
          ...lookup,
          [key]: Utils.array.withoutValue(lookup[key], referenceValue),
        }
      : lookup;

export const removeManyOutByKeyPortFromNode = (node: Realtime.Node, keys: string[]): { ports: Realtime.NodePorts } => ({
  ports: {
    ...node.ports,
    out: {
      ...node.ports.out,
      byKey: Object.entries(node.ports.out.byKey)
        .filter(([key]) => !keys.includes(key))
        .reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {}),
    },
  },
});

export const removeOutByKeyPortFromNode = (node: Realtime.Node, key: string): { ports: Realtime.NodePorts } => {
  const { [key]: _, ...byKey } = node.ports.out.byKey;

  return {
    ports: {
      ...node.ports,
      out: {
        ...node.ports.out,
        byKey,
      },
    },
  };
};

export const removeOutDynamicPortFromNode = (node: Realtime.Node, portID: string): { ports: Realtime.NodePorts } => ({
  ports: {
    ...node.ports,
    out: {
      ...node.ports.out,
      dynamic: Utils.array.withoutValue(node.ports.out.dynamic, portID),
    },
  },
});

export const removeOutBuiltInPortFromNode = (node: Realtime.Node, portType: BaseModels.PortType): { ports: Realtime.NodePorts } => {
  const { [portType]: _, ...builtIn } = node.ports.out.builtIn;

  return {
    ports: {
      ...node.ports,
      out: {
        ...node.ports.out,
        builtIn,
      },
    },
  };
};

export const reorderOutDynamicPorts =
  (nodeID: string, from: number, to: number) =>
  (state: DiagramState): DiagramState => {
    const node = Utils.normalized.getNormalizedByKey(state.nodes, nodeID);

    return {
      ...state,
      nodes: Normal.patchOne(state.nodes, node.id, {
        ports: {
          ...node.ports,
          out: {
            ...node.ports.out,
            dynamic: Utils.array.reorder(node.ports.out.dynamic, from, to),
          },
        },
      }),
    };
  };

export const addLinkToState =
  (link: Realtime.Link) =>
  (state: DiagramState): DiagramState => {
    const sourceNodeID = link.source.nodeID;
    const targetNodeID = link.target.nodeID;

    return {
      ...state,
      links: Normal.appendOne(state.links, link.id, link),
      linksByPortID: Utils.functional.compose(
        addReferenceByKey(link.source.portID, link.id),
        addReferenceByKey(link.target.portID, link.id)
      )(state.linksByPortID),
      linksByNodeID: Utils.functional.compose(
        addReferenceByKey(sourceNodeID, link.id),
        addReferenceByKey(targetNodeID, link.id)
      )(state.linksByNodeID),
      linkedNodesByNodeID: Utils.functional.compose(
        addReferenceByKey(sourceNodeID, targetNodeID),
        addReferenceByKey(targetNodeID, sourceNodeID)
      )(state.linkedNodesByNodeID),
    };
  };

export const addAllLinksToState = (links: Realtime.Link[]): DiagramStateComposeReducer => Utils.functional.compose(...links.map(addLinkToState));

export const removeLinkFromState =
  (linkID: string) =>
  (state: DiagramState): DiagramState => {
    const link = Normal.getOne(state.links, linkID);

    // the link is already removed
    if (!link) {
      return state;
    }

    const sourceNodeID = link.source.nodeID;
    const targetNodeID = link.target.nodeID;

    return {
      ...state,
      links: Normal.removeOne(state.links, linkID),
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

export const removeAllLinksFromState = (linkIDs: string[]): DiagramStateComposeReducer =>
  Utils.functional.compose(...linkIDs.map(removeLinkFromState));

export const removeManyPortsFromState =
  (portIDs: string[]) =>
  (state: DiagramState): DiagramState => ({
    ...state,
    ports: Normal.removeMany(state.ports, portIDs),
  });

export const removePortFromState =
  (portID: string) =>
  (state: DiagramState): DiagramState => ({
    ...state,
    ports: Normal.removeOne(state.ports, portID),
  });

export const removeAllPortsFromState = (portIDs: string[]): DiagramStateComposeReducer =>
  Utils.functional.compose(...portIDs.map(removePortFromState));

export const removeOutDynamicPortFromBlockInState = (portID: string): DiagramStateComposeReducer =>
  Utils.functional.compose(removePortFromState(portID), (state: DiagramState) => {
    const port = Utils.normalized.getNormalizedByKey(state.ports, portID);
    const node = Utils.normalized.getNormalizedByKey(state.nodes, port.nodeID);

    return {
      ...state,
      nodes: Normal.patchOne(state.nodes, node.id, removeOutDynamicPortFromNode(node, portID)),
    };
  });

export const removeManyOutByKeyPortFromBlockInState = (portsToRemove: { key: string; portID: string }[]): DiagramStateComposeReducer =>
  Utils.functional.compose(removeManyPortsFromState(portsToRemove.map(({ portID }) => portID)), (state: DiagramState) => {
    const portIDs = portsToRemove.map(({ portID }) => portID);
    const ports = Utils.normalized.getAllNormalizedByKeys(state.ports, portIDs);
    const groupedPorts = _groupBy(ports, 'nodeID');

    const portsToRemoveByPortID = Utils.normalized.normalize(portsToRemove, ({ portID }) => portID);

    const nodes = Utils.normalized.getAllNormalizedByKeys(state.nodes, Object.keys(groupedPorts));

    const updatedNodes = nodes.map((node) => {
      const ports = groupedPorts[node.id];
      const keys = ports.map(({ id }) => portsToRemoveByPortID.byKey[id].key);
      return { key: node.id, value: removeManyOutByKeyPortFromNode(node, keys) };
    });

    return {
      ...state,
      nodes: Normal.patchMany(state.nodes, updatedNodes),
    };
  });

export const removeOutBuiltInPortFromBlockInState = (portType: BaseModels.PortType, portID: string): DiagramStateComposeReducer =>
  Utils.functional.compose(removePortFromState(portID), (state: DiagramState) => {
    const port = Utils.normalized.getNormalizedByKey(state.ports, portID);
    const node = Utils.normalized.getNormalizedByKey(state.nodes, port.nodeID);

    return {
      ...state,
      nodes: Normal.patchOne(state.nodes, node.id, removeOutBuiltInPortFromNode(node, portType)),
    };
  });

export const updateRootNodesInState =
  (nodeID: string, nodePatch: Partial<Realtime.Node>) =>
  (state: DiagramState): DiagramState =>
    !isMarkupBlockType(nodePatch.type ?? Utils.normalized.getNormalizedByKey(state.nodes, nodeID).type) && 'parentNode' in nodePatch
      ? {
          ...state,
          rootNodeIDs: nodePatch.parentNode ? Utils.array.withoutValue(state.rootNodeIDs, nodeID) : Utils.array.append(state.rootNodeIDs, nodeID),
        }
      : state;

export const addNodeToMarkupNodes =
  (nodeID: string, node: Realtime.Node) =>
  (state: DiagramState): DiagramState =>
    isMarkupBlockType(node.type)
      ? {
          ...state,
          markupNodeIDs: Utils.array.append(state.markupNodeIDs, nodeID),
        }
      : state;

export const updateNodeInState = (node: Realtime.Node): DiagramStateComposeReducer =>
  Utils.functional.compose(updateRootNodesInState(node.id, node), (state: DiagramState) => ({
    ...state,
    nodes: Normal.updateOne(state.nodes, node.id, node),
  }));

export const patchNodeInState = (nodeID: string, nodePatch: Partial<Realtime.Node>): DiagramStateComposeReducer =>
  Utils.functional.compose(updateRootNodesInState(nodeID, nodePatch), (state: DiagramState) => ({
    ...state,
    nodes: Normal.patchOne(state.nodes, nodeID, nodePatch),
  }));

export const addNode =
  (node: Realtime.Node, data: Realtime.NodeData<unknown>) =>
  (state: DiagramState): DiagramState => ({
    ...state,
    nodes: Normal.appendOne(state.nodes, node.id, node),
    data: {
      ...state.data,
      [node.id]: data,
    },
  });

export const addNodeToState = (node: Realtime.Node, data: Realtime.NodeData<unknown>): DiagramStateComposeReducer =>
  Utils.functional.compose(updateRootNodesInState(node.id, node), addNodeToMarkupNodes(node.id, node), addNode(node, data));

export const addAllNodesToState = (nodesWithData: { node: Realtime.Node; data: Realtime.NodeData<unknown> }[]): DiagramStateComposeReducer =>
  Utils.functional.compose(...nodesWithData.map(({ node, data }) => addNodeToState(node, data)));

export const removeNodeFromState =
  (node: Realtime.Node) =>
  (state: DiagramState): DiagramState => {
    const { [node.id]: data, ...dataWithoutNode } = state.data;

    return {
      ...state,
      nodes: Normal.removeOne(state.nodes, node.id),
      rootNodeIDs: Utils.array.withoutValue(state.rootNodeIDs, node.id),
      markupNodeIDs: Utils.array.withoutValue(state.markupNodeIDs, node.id),
      data: dataWithoutNode,
    };
  };

export const removeBlockFromState =
  (node: Realtime.Node) =>
  (state: DiagramState): DiagramState =>
    Utils.functional.compose(
      removeAllLinksFromState(getLinkIDsByNodeID(state)(node.id)),
      removeAllPortsFromState(Realtime.Utils.port.flattenAllPorts(node.ports)),
      removeNodeFromState(node)
    )(state);

export const removeAllBlocksFromState = (nodes: Realtime.Node[]): DiagramStateComposeReducer =>
  Utils.functional.compose(...nodes.map(removeBlockFromState));

export const addPortToState =
  (port: Realtime.Port) =>
  (state: DiagramState): DiagramState => ({
    ...state,
    ports: Normal.appendOne(state.ports, port.id, port),
  });

export const addAllPortsToState = (ports: Realtime.Port[]): DiagramStateComposeReducer => Utils.functional.compose(...ports.map(addPortToState));

export const addBlockToState = (node: Realtime.Node, ports: Realtime.Port[], data: Realtime.NodeData<unknown>): DiagramStateComposeReducer =>
  Utils.functional.compose(addNodeToState(node, data), addAllPortsToState(ports));

export const addActionsToState = (node: Realtime.Node, ports: Realtime.Port[], data: Realtime.NodeData<unknown>): DiagramStateComposeReducer =>
  Utils.functional.compose(addNode(node, data), addAllPortsToState(ports));

export const addOutByKeyPortToBlockInState =
  (key: string, port: Realtime.Port) =>
  (state: DiagramState): DiagramState => {
    const node = Utils.normalized.getNormalizedByKey(state.nodes, port.nodeID);

    return Utils.functional.compose(
      patchNodeInState(port.nodeID, {
        ports: {
          ...node.ports,
          out: {
            ...node.ports.out,
            byKey: {
              ...node.ports.out.byKey,
              [key]: port.id,
            },
          },
        },
      }),
      addPortToState(port)
    )(state);
  };

export const addOutDynamicPortToBlockInState =
  (port: Realtime.Port) =>
  (state: DiagramState): DiagramState => {
    const node = Utils.normalized.getNormalizedByKey(state.nodes, port.nodeID);

    return Utils.functional.compose(
      patchNodeInState(port.nodeID, {
        ports: {
          ...node.ports,
          out: {
            ...node.ports.out,
            dynamic: [...node.ports.out.dynamic, port.id],
          },
        },
      }),
      addPortToState(port)
    )(state);
  };

export const addOutBuiltInPortToBlockInState =
  (portType: BaseModels.PortType, port: Realtime.Port) =>
  (state: DiagramState): DiagramState => {
    const node = Utils.normalized.getNormalizedByKey(state.nodes, port.nodeID);

    return Utils.functional.compose(
      patchNodeInState(port.nodeID, {
        ports: {
          ...node.ports,
          out: {
            ...node.ports.out,
            builtIn: {
              ...node.ports.out.builtIn,
              [portType]: port.id,
            },
          },
        },
      }),
      addPortToState(port)
    )(state);
  };

export const patchPortInState =
  (portID: string, portPatch: Partial<Realtime.Port>) =>
  (state: DiagramState): DiagramState => ({
    ...state,
    ports: Normal.patchOne(state.ports, portID, portPatch),
  });

export const patchLinkInState =
  (linkID: string, linkPatch: Partial<Realtime.Link>) =>
  (state: DiagramState): DiagramState => ({
    ...state,
    links: Normal.patchOne(state.links, linkID, linkPatch),
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

export const buildPortForNode =
  (nodeID: string) =>
  (port: Realtime.PartialModel<Realtime.Port>): Realtime.Port =>
    portFactory(nodeID, port.id, port);

export const buildNewNode = (node: NodeDescriptor, data: DataDescriptor): [Realtime.Node, Realtime.Port[], Realtime.NodeData<unknown>] => {
  const buildPort = buildPortForNode(node.id);
  const inPorts = node.ports.in.map(buildPort);
  const outDynamicPorts = node.ports.out.dynamic.map(buildPort);
  const outByKeyPorts = Utils.object.mapValue(node.ports.out.byKey, buildPort);
  const outBuiltInPortsEntities = Object.entries(node.ports.out.builtIn)
    .filter(([, port]) => !!port)
    .map(([type, port]) => [type, buildPort(port)] as const);

  const newNodeData = {
    ...data,
    nodeID: node.id,
    type: node.type,
    blockColor: COLOR_PICKER_CONSTANTS.BLOCK_STANDARD_COLOR,
  };
  const newNode = nodeFactory(node.id, {
    ...node,
    ports: {
      in: inPorts.map((port) => port.id),
      out: {
        byKey: Utils.object.mapValue(outByKeyPorts, (port) => port.id),
        dynamic: outDynamicPorts.map((port) => port.id),
        builtIn: outBuiltInPortsEntities.reduce((acc, [type, port]) => ({ ...acc, [type]: port.id }), {}),
      },
    },
  });

  return [
    newNode,
    [...inPorts, ...outDynamicPorts, ...outBuiltInPortsEntities.map(([, port]) => port), ...Object.values(outByKeyPorts)],
    newNodeData,
  ];
};
