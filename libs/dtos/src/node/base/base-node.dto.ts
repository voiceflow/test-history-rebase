import { z } from 'zod';

import { DiagramNodeDTO } from '@/diagram/diagram-node.dto';

import { NodeType } from '../node-type.enum';
import { BasePortsDTO } from './base-ports.dto';

export const BaseNodeDataDTO = z
  .object({
    name: z.string().optional(),
    portsV2: BasePortsDTO,
  })
  .strict();

export type BaseNodeData = z.infer<typeof DiagramNodeDTO>;

export const BaseNodeDTO = DiagramNodeDTO.extend({
  type: z.nativeEnum(NodeType),
  data: BaseNodeDataDTO,
}).strict();

export type BaseNode = z.infer<typeof BaseNodeDTO>;

export type InferNode<N extends z.ZodType<any> & { ['_output']: BaseNode }> = z.infer<N>;
