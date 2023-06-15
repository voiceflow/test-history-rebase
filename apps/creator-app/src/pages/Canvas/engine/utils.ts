/* eslint-disable max-classes-per-file */
import { BaseNode } from '@voiceflow/base-types';
import { NullableRecord, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Logger } from '@voiceflow/ui';

import { CanvasAPI } from '@/components/Canvas';
import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { FeatureFlagMap } from '@/ducks/feature';
import { NodeDescriptorOptionalPorts } from '@/pages/Canvas/managers/types';
import { getManager } from '@/pages/Canvas/managers/utils';
import { Dispatcher, DispatchResult, Selector } from '@/store/types';
import { Pair, Point } from '@/types';

import type Engine from '.';

export const DUPLICATE_OFFSET: Pair<number> = [40, 40];

export interface NodeCandidate {
  nodeID: string;
  containsPoint: (point: [number, number]) => boolean;
  isWithin: (rect: DOMRect) => boolean;
}

export interface CloneUtils {
  getNodeID: (nodeID: string) => string;
  getPortID: (portID: string) => string;
}

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
  constructor(protected engine: Engine) {
    super();

    engine.log.debug(this.engine.log.init('initializing'), this.engine.log.value(Object.getPrototypeOf(this).constructor.name));
  }

  get dispatch() {
    return this.engine.store.dispatch;
  }

  bind<T extends Dispatcher<any[]>>(dispatcher: T) {
    return (...args: Parameters<T>): DispatchResult<ReturnType<T>> => this.engine.store.dispatch(dispatcher(...args));
  }

  select<T, A extends any[]>(selector: Selector<T, A>, ...args: A) {
    return this.engine.select(selector, ...args);
  }

  /**
   * clear any active data before a new diagram is being loaded
   */
  reset() {
    // noop
  }

  /**
   * remove any subscriptions before the canvas is unmounted
   * reset() will be called before teardown()
   */
  teardown() {
    // noop
  }
}

export function nodeDescriptorFactory(
  nodeID: string,
  type: BlockType,
  factoryData?: Partial<Realtime.NodeData<unknown>>,
  options?: { defaultVoice: string; canvasNodeVisibility: BaseNode.Utils.CanvasNodeVisibility; features?: FeatureFlagMap }
): { node: Creator.NodeDescriptor; data: Creator.DataDescriptor } {
  if (type === BlockType.COMMENT || type === BlockType.CHOICE_OLD) {
    throw new Error('attempted to create a deprecated node');
  }

  const config = getManager(type);

  const {
    node: { ports, ...node },
    data,
  } = config.factory?.(factoryData, options) ?? { node: {} as NodeDescriptorOptionalPorts, data: {} as any };

  return {
    node: {
      ...Creator.Factories.nodeFactory(nodeID, { ...node, type }),
      ports: {
        in: ports?.in?.map((port) => ({ ...port, id: Realtime.Utils.port.getInPortID(nodeID) })) ?? [],
        out: {
          byKey: Utils.object.mapValue(ports?.out?.byKey || {}, (port) => ({ ...port, id: Utils.id.objectID() })),
          dynamic: ports?.out?.dynamic?.map((port) => ({ ...port, id: Utils.id.objectID() })) ?? [],
          builtIn: Object.entries(ports?.out?.builtIn ?? {})
            .filter(([, port]) => !!port)
            .reduce((acc, [type, port]) => Object.assign(acc, { [type]: { ...port, id: Utils.id.objectID() } }), {}),
        },
      },
    },
    data,
  };
}

export const cloneLink =
  ({ getPortID, getNodeID }: CloneUtils) =>
  (link: Realtime.Link): Realtime.Link => ({
    ...link,
    id: Utils.id.objectID(),
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
  ({ node, data }: Realtime.NodeWithData): Realtime.NodeWithData => {
    const originNode = node;
    const originNodeData: Realtime.NodeData<unknown> = data;

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
          out: {
            byKey: Utils.object.mapValue(originNode.ports.out.byKey, getPortID),
            dynamic: originNode.ports.out.dynamic.map(getPortID),
            builtIn: Object.entries(originNode.ports.out.builtIn)
              .filter(([, portID]) => !!portID)
              .reduce((acc, [type, portID]) => Object.assign(acc, { [type]: getPortID(portID) }), {}),
          },
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
  (port: Realtime.Port): Realtime.Port => {
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
  return (lookup[id] = Utils.id.objectID());
};

export interface CloneContextOptions {
  nodeIDLookup?: Record<string, string>;
  portIDLookup?: Record<string, string>;
  diagramID?: string;
}

export const createCloneContext = ({ nodeIDLookup = {}, portIDLookup = {} }: CloneContextOptions = {}) => {
  return {
    getNodeID: getOrCreateID(nodeIDLookup),
    getPortID: getOrCreateID(portIDLookup),
  };
};

export const mergeEntityMaps = (lhs: Realtime.EntityMap, rhs: Realtime.EntityMap) => ({
  nodesWithData: [...lhs.nodesWithData, ...rhs.nodesWithData],
  ports: [...lhs.ports, ...rhs.ports],
  links: [...lhs.links, ...rhs.links],
});

export const cloneEntityMap = (
  { nodesWithData, ports, links }: Realtime.EntityMap,
  options?: CloneContextOptions
): {
  ports: Realtime.Port[];
  links: Realtime.Link[];
  nodesWithData: Realtime.NodeWithData[];
} => {
  const context = createCloneContext(options);

  const clonedPorts = ports.map(clonePort(context));

  const clonedNodesWithData: Realtime.NodeWithData[] = [];

  nodesWithData.forEach((node) => {
    const clonedNodeData = cloneNodeWithData(context)(node);
    clonedNodesWithData.push(clonedNodeData);
  });

  const clonedLinks = links.map(cloneLink(context));

  return {
    ports: clonedPorts,
    links: clonedLinks,
    nodesWithData: clonedNodesWithData,
  };
};

export const extractPoints = (canvas: CanvasAPI, start: DOMRect | null | undefined, end: DOMRect | null | undefined): Pair<Point> | null => {
  if (!start || !end) return null;

  const startY = start.top + start.height / 2;
  const endY = end.top + start.height / 2;

  return [canvas.transformPoint([start.right, startY]), canvas.transformPoint([end.left, endY])];
};

export const toCanvasRect = (canvas: CanvasAPI, rect: DOMRect, options?: { relative?: boolean }): DOMRect => {
  const zoom = canvas.getZoom();
  const [x, y] = canvas.transformPoint([rect.x, rect.y], options);

  return new DOMRect(x, y, rect.width / zoom, rect.height / zoom);
};

export const createBoundaryTest =
  ({ left, right, top, bottom }: Pick<DOMRect, 'left' | 'right' | 'top' | 'bottom'>) =>
  ([x, y]: Point) =>
    Utils.number.isInRange(x, left, right) && Utils.number.isInRange(y, top, bottom);

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
        (Utils.number.isInRange(left, rect.left, rect.right) || Utils.number.isInRange(right, rect.left, rect.right)) &&
        (Utils.number.isInRange(top, rect.top, rect.bottom) || Utils.number.isInRange(bottom, rect.top, rect.bottom)),
    }));

export const getNodesData = (nodeData: Record<string, Realtime.NodeData<unknown>>, selectedNodes: Realtime.Node[]) => {
  const nodeIDs = selectedNodes
    .map((node) => [node.id, ...node.combinedNodes] || [])
    .flat()
    .reduce<string[]>((acc, curr) => (acc.includes(curr) ? acc : [...acc, curr]), []);

  return nodeIDs.map((nodeID) => nodeData[nodeID]);
};

export const getCopiedNodeDataIDs = (nodeData: Record<string, Realtime.NodeData<unknown>>, copiedNodes: Realtime.Node[]) => {
  const copiedNodesData = getNodesData(nodeData, copiedNodes);
  const intentIDs: string[] = [];
  const customBlockIDs: string[] = [];

  copiedNodesData.forEach((data) => {
    if (Realtime.Utils.node.isLinkedIntentNode(data) && data.intent) {
      intentIDs.push(data.intent);
    }

    if (Realtime.Utils.node.isCustomBlockPointer(data) && data.sourceID) {
      customBlockIDs.push(data.sourceID);
    }

    if (Realtime.Utils.node.isChoiceNode(data)) {
      data.choices.forEach((choice) => {
        const { intent } = choice;

        if (intent) {
          intentIDs.push(intent);
        }
      }, []);
    }
  });

  const productIDs = Utils.array.unique(copiedNodesData.filter(Realtime.Utils.node.isProductLinkedNode).map((node) => node.productID));

  const diagramIDs = Utils.array.unique(copiedNodesData.filter(Realtime.Utils.node.isLinkedDiagramNode).map((node) => node.diagramID));

  return { intentIDs: Utils.array.unique(intentIDs), productIDs, diagramIDs, customBlockIDs: Utils.array.unique(customBlockIDs) };
};

export const createPortRemap = (node: Realtime.Node | null, targetNodeID: string | null = null): Realtime.NodePortRemap[] =>
  node
    ? [
        {
          nodeID: node.id,
          ports: [
            ...node.ports.out.dynamic.map((portID) => ({ portID })),
            ...Object.entries(node.ports.out.builtIn).map(([type, portID]) => ({ type, portID })),
            // do not remap ports.out.byKey, they should always retain their targets
          ],
          targetNodeID,
        },
      ]
    : [];
