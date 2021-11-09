import { WithRequired } from '@voiceflow/common';
import { Overwrite } from 'utility-types';

import { BlockVariant } from '@/constants/canvas';
import { BlockNodeData, Link, Node, NodeData, Port } from '@/models';

export const linkFactory = (sourcePort: Port, targetPort: Port, linkID: string): Link => ({
  id: linkID,
  source: { nodeID: sourcePort.nodeID, portID: sourcePort.id },
  target: { nodeID: targetPort.nodeID, portID: targetPort.id },
});

export const portFactory = (nodeID: string, portID: string, port: Partial<Port>): Port => ({
  label: null,
  platform: null,
  virtual: false,
  ...port,
  id: portID,
  nodeID,
});

export const nodeFactory = <T extends string | null>(nodeID: T, node: WithRequired<Partial<Node>, 'type'>): Overwrite<Node, { id: T }> => ({
  x: 0,
  y: 0,
  parentNode: null,
  combinedNodes: [],
  ports: {
    in: [],
    out: [],
  },
  ...node,
  id: nodeID,
});

export const nodeDataFactory = (nodeID: string, data: WithRequired<Partial<NodeData<unknown>>, 'type'>): NodeData<unknown> => ({
  name: 'Block',
  ...data,
  path: [],
  nodeID,
});

export const blockNodeDataFactory = (nodeID: string, data: WithRequired<Partial<BlockNodeData<unknown>>, 'type'>): BlockNodeData<unknown> => ({
  blockColor: BlockVariant.STANDARD,
  ...nodeDataFactory(nodeID, data),
});
