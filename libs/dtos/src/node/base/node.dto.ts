import { z } from 'zod';

import { DiagramNodeDTO } from '@/diagram/diagram-node.dto';

import { NodeType } from '../node-type.enum';
import { SystemPortType } from '../system-port-type.enum';

export const BasePortDTO = z.object({
  id: z.string(),

  type: z.union([z.string(), z.nativeEnum(SystemPortType)]),

  target: z.string().nullable().describe('Id of the node that the port points to'),
});

export type BasePort = z.infer<typeof BasePortDTO>;

export const BaseNodeDataDTO = z.object({
  name: z.string().optional(),
  portsV2: z.object({
    byKey: z.record(BasePortDTO).describe('Mapping of arbitrary string key to port'),
  }),
});

export type BaseNodeData = z.infer<typeof DiagramNodeDTO>;

export const BaseNodeDTO = DiagramNodeDTO.extend({
  type: z.nativeEnum(NodeType),
  data: BaseNodeDataDTO.optional(),
});

export type BaseNode = z.infer<typeof BaseNodeDTO>;

export type InferNode<N extends z.ZodType<any> & { ['_output']: BaseNode }> = z.infer<N>;
