import { WithRequired } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { COLOR_PICKER_CONSTANTS } from '@voiceflow/ui';
import { Overwrite } from 'utility-types';

export const linkFactory = (sourcePort: Realtime.Port, targetPort: Realtime.Port, linkID: string): Realtime.Link => ({
  id: linkID,
  source: { nodeID: sourcePort.nodeID, portID: sourcePort.id },
  target: { nodeID: targetPort.nodeID, portID: targetPort.id },
});

export const portFactory = (nodeID: string, portID: string, port: Partial<Realtime.Port>): Realtime.Port => ({
  label: null,
  ...port,
  id: portID,
  nodeID,
});

export const nodeFactory = <T extends string | null>(
  nodeID: T,
  node: WithRequired<Partial<Realtime.Node>, 'type'>
): Overwrite<Realtime.Node, { id: T }> => ({
  x: 0,
  y: 0,
  parentNode: null,
  combinedNodes: [],
  ports: {
    in: [],
    out: {
      byKey: {},
      dynamic: [],
      builtIn: {},
    },
  },
  ...node,
  id: nodeID,
});

export const nodeDataFactory = (nodeID: string, data: WithRequired<Partial<Realtime.NodeData<unknown>>, 'type'>): Realtime.NodeData<unknown> => ({
  name: 'Block',
  ...data,
  nodeID,
});

export const blockNodeDataFactory = (nodeID: string, data: Partial<Realtime.BlockNodeData<unknown>> = {}): Realtime.BlockNodeData<unknown> => ({
  blockColor: COLOR_PICKER_CONSTANTS.BLOCK_STANDARD_COLOR,
  ...nodeDataFactory(nodeID, { type: Realtime.BlockType.COMBINED, ...data }),
});
