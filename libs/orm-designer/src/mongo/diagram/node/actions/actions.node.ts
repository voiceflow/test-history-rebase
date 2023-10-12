import { z } from 'zod';

import { Node } from '../node.dto';
import { NodeType } from '../node-type.enum';

export const ActionsNodeData = z.object({
  actionIDs: z.string().array(),
});

export type ActionsNodeData = z.infer<typeof ActionsNodeData>;

export const ActionsNode = Node(NodeType.ACTIONS__V3, ActionsNodeData);

export type ActionsNode = z.infer<typeof ActionsNode>;
