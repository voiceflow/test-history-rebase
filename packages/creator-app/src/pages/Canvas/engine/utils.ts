/* eslint-disable max-classes-per-file */
import { CanvasNodeVisibility } from '@voiceflow/general-types';
import { Logger } from '@voiceflow/ui';

import { CanvasAPI } from '@/components/Canvas';
import { BlockType, PlatformType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { FeatureFlagMap } from '@/ducks/feature';
import { EntityMap, Link, Node, NodeData, NodeWithData, Port } from '@/models';
import { getManager } from '@/pages/Canvas/managers';
import { NodeDescriptor } from '@/pages/Canvas/managers/types';
import { Dispatchable, Dispatcher, DispatchResult, Selector } from '@/store/types';
import { NullableRecord, Pair, Point } from '@/types';
import { objectID } from '@/utils';
import { asyncForEach, unique } from '@/utils/array';
import { isChoiceNode, isLinkedFlowNode, isLinkedIntentNode, isProductLinkedNode } from '@/utils/node';
import { isInRange } from '@/utils/number';
import { getDistinctPlatformValue } from '@/utils/platform';

import type { Engine } from '.';

export type NodeCandidate = {
  nodeID: string;
  containsPoint: (point: [number, number]) => boolean;
  isWithin: (rect: DOMRect) => boolean;
};

export type CloneUtils = {
  getNodeID: (nodeID: string) => string;
  getPortID: (portID: string) => string;
};

export class ComponentManager<C extends Record<string, unknown> = Record<string, unknown>> {
  log: Logger | null = null;

  components: Partial<NullableRecord<C>> = {};

  register<K extends keyof C>(name: K, component: C[K] | null) {
    this.components[name] = component;

    this.log?.debug(this.log.init(component === null ? 'expired' : 'registered'), this.log.value(name));

    return () => {
      this.components[name] = null;

      this.log?.debug(this.log.reset('expired'), this.log.value(name));
    };
  }
}

export class EngineConsumer<C extends Record<string, unknown> = Record<string, unknown>> extends ComponentManager<C> {
  // eslint-disable-next-line no-useless-constructor
  constructor(protected engine: Engine) {
    super();

    engine.log.debug(this.engine.log.init('initializing'), this.engine.log.value(Object.getPrototypeOf(this).constructor.name));
  }

  dispatch<T extends Dispatchable>(dispatchable: T) {
    return this.engine.store.dispatch<T>(dispatchable);
  }

  bind<T extends Dispatcher<any[]>>(dispatcher: T) {
    return (...args: Parameters<T>): DispatchResult<ReturnType<T>> => this.engine.store.dispatch(dispatcher(...args));
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
  factoryData?: Partial<NodeData<unknown>>,
  options?: { defaultVoice: string; canvasNodeVisibility: CanvasNodeVisibility; features?: FeatureFlagMap }
): { node: Omit<Creator.NodeDescriptor, 'id'>; data: Creator.DataDescriptor } {
  const config = getManager(type);

  const {
    node: { ports, ...node },
    data,
  } = config?.factory?.(factoryData, options) ?? { node: {} as NodeDescriptor, data: {} as any };

  return {
    node: {
      ...Creator.Factories.nodeFactory(null, { ...node, type }),
      ports: {
        in: ((ports || {}).in || []).map((port) => ({ ...port, id: objectID() })),
        out: ((ports || {}).out || []).map((port) => ({ ...port, id: objectID() })),
      },
    },
    data,
  };
}

export const cloneLink =
  ({ getPortID, getNodeID }: CloneUtils) =>
  (link: Link): Link => ({
    ...link,
    id: objectID(),
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

export const cloneNodeWithData =
  ({ getNodeID, getPortID }: CloneUtils) =>
  async ({ node, data }: NodeWithData): Promise<NodeWithData> => {
    const originNode = node;
    const originNodeData: NodeData<unknown> = data;

    const newID = getNodeID(originNode.id);

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

export const clonePort =
  ({ getNodeID, getPortID }: CloneUtils) =>
  (port: Port): Port => {
    const newID = getPortID(port.id);
    const nodeID = getNodeID(port.nodeID);

    return {
      ...port,
      id: newID,
      nodeID,
    };
  };

const getOrCreateID = (lookup: Record<string, string>) => (id: string) => {
  if (Object.prototype.hasOwnProperty.call(lookup, id)) {
    return lookup[id];
  }

  // eslint-disable-next-line no-return-assign
  return (lookup[id] = objectID());
};

export type CloneContextOptions = {
  nodeIDLookup?: Record<string, string>;
  portIDLookup?: Record<string, string>;
};

export const createCloneContext = ({ nodeIDLookup = {}, portIDLookup = {} }: CloneContextOptions = {}) => {
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

export const cloneEntityMap = async ({ nodesWithData, ports, links }: EntityMap, options?: CloneContextOptions) => {
  const context = createCloneContext(options);

  const clonedPorts = ports.map(clonePort(context));

  const clonedNodesWithData: NodeWithData[] = [];

  await asyncForEach(nodesWithData, async (nodeData) => {
    const clonedNodeData = await cloneNodeWithData(context)(nodeData);
    clonedNodesWithData.push(clonedNodeData);
  });

  const clonedLinks = links.map(cloneLink(context));

  return {
    nodesWithData: clonedNodesWithData,
    ports: clonedPorts,
    links: clonedLinks,
  };
};

export const extractPoints = (canvas: CanvasAPI, start: DOMRect | null | undefined, end: DOMRect | null | undefined): Pair<Point> | null => {
  if (!start || !end) return null;

  const startY = start.top + start.height / 2;
  const endY = end.top + start.height / 2;

  return [canvas.transformPoint([start.right, startY]), canvas.transformPoint([end.left, endY])];
};

export const createBoundaryTest =
  ({ left, right, top, bottom }: Pick<DOMRect, 'left' | 'right' | 'top' | 'bottom'>) =>
  ([x, y]: Point) =>
    isInRange(x, left, right) && isInRange(y, top, bottom);

export const getCandidates = (nodeIDs: string[], engine: Engine): NodeCandidate[] =>
  nodeIDs
    .reduce<{ nodeID: string; top: number; left: number; bottom: number; right: number }[]>((acc, nodeID) => {
      const rect = engine.node.getRect(nodeID);

      if (!rect) return acc;

      const { left, right, top, bottom } = rect;

      acc.push({
        nodeID,
        left,
        right,
        top,
        bottom,
      });

      return acc;
    }, [])
    .map(({ nodeID, left, right, top, bottom }) => ({
      nodeID,
      containsPoint: createBoundaryTest({ left, right, top, bottom }),
      isWithin: (rect) =>
        (isInRange(left, rect.left, rect.right) || isInRange(right, rect.left, rect.right)) &&
        (isInRange(top, rect.top, rect.bottom) || isInRange(bottom, rect.top, rect.bottom)),
    }));

export const getNodesData = (nodeData: Record<string, NodeData<unknown>>, selectedNodes: Node[]) => {
  const nodeIDs = selectedNodes
    .map((node) => [node.id, ...node.combinedNodes] || [])
    .flat()
    .reduce<string[]>((acc, curr) => (acc.includes(curr) ? acc : [...acc, curr]), []);

  return nodeIDs.map((nodeID) => nodeData[nodeID]);
};

export const getCopiedNodeDataIDs = (nodeData: Record<string, NodeData<unknown>>, copiedNodes: Node[], platform: PlatformType) => {
  const copiedNodesData = getNodesData(nodeData, copiedNodes);
  const intents: string[] = [];

  copiedNodesData.forEach((data) => {
    if (isLinkedIntentNode(data, platform)) {
      intents.push(getDistinctPlatformValue(platform, data).intent);
    }

    if (isChoiceNode(data)) {
      data.choices.forEach((choice) => {
        const { intent } = getDistinctPlatformValue(platform, choice);

        if (intent) {
          intents.push(intent);
        }
      }, []);
    }
  });

  const products = unique(copiedNodesData.filter(isProductLinkedNode).map((node) => node.productID));

  const diagrams = unique(copiedNodesData.filter(isLinkedFlowNode).map((node) => node.diagramID));

  return { intents: unique(intents), products, diagrams };
};
