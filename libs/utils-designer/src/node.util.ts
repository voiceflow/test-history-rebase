import { Utils } from '@voiceflow/common';
import type { BlockNode, DiagramNode, StartNode, TriggerNode } from '@voiceflow/dtos';
import { NodeSystemPortType, NodeType, START_NODE_POSITION } from '@voiceflow/dtos';

import { nodePortFactory, nodePortsFactory } from './node-port.util';

export const diagramNodeFactory = <Node extends DiagramNode>(node: Omit<Node, 'nodeID'> & { nodeID?: string }): Node =>
  ({
    ...node,
    nodeID: node.nodeID ?? Utils.id.objectID(),
  }) as Node;

type NodeFactoryOptions<Node extends DiagramNode> = Pick<Node, 'coords'> & {
  data?: Partial<Node['data']>;
  nodeID?: string;
};

export const startNodeFactory = ({ data, coords = START_NODE_POSITION, ...rest }: NodeFactoryOptions<StartNode> = {}) =>
  diagramNodeFactory<StartNode>({
    ...rest,
    type: NodeType.START,
    data: {
      name: data?.name ?? 'Start',
      color: data?.color ?? '#56b365',
      triggers: data?.triggers ?? [],
      portsV2:
        data?.portsV2 ??
        nodePortsFactory({
          builtIn: { [NodeSystemPortType.NEXT]: nodePortFactory({ type: NodeSystemPortType.NEXT, target: null }) },
        }),
    },
    coords,
  });

export const blockNodeFactory = ({ data, ...rest }: NodeFactoryOptions<BlockNode>) =>
  diagramNodeFactory<BlockNode>({
    ...rest,
    type: NodeType.BLOCK,
    data: {
      name: data?.name ?? '',
      color: data?.color ?? '',
      steps: data?.steps ?? [],
      portsV2: data?.portsV2 ?? nodePortsFactory(),
    },
  });

export const triggerNodeFactory = ({ data, ...reset }: NodeFactoryOptions<TriggerNode> = {}) =>
  diagramNodeFactory<TriggerNode>({
    ...reset,
    type: NodeType.TRIGGER,
    data: {
      name: data?.name ?? '',
      items: data?.items ?? [],
      portsV2:
        data?.portsV2 ??
        nodePortsFactory({
          byKey: { [NodeSystemPortType.NEXT]: nodePortFactory({ type: NodeSystemPortType.NEXT, target: null }) },
        }),
    },
  });
