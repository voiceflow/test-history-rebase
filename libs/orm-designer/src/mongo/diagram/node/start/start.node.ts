import { z } from 'zod';

import { Node, NodeCoordinates, NodePorts, NodePortsWithNext } from '../node.dto';
import { NodeType } from '../node-type.enum';

export const StartNodeData = z.object({
  label: z.string(),
});

export type StartNodeData = z.infer<typeof StartNodeData>;

export const StartNode = Node(NodeType.START__V3, StartNodeData)
  .merge(NodeCoordinates)
  .merge(NodePorts(NodePortsWithNext));

export type StartNode = z.infer<typeof StartNode>;
