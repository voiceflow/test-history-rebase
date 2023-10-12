import { z } from 'zod';

import { Node, NodeChild, NodePorts } from '../node/node.dto';
import type { NodeType } from '../node/node-type.enum';
import type { Port } from '../port/port.dto';

export const BaseActionData = z.object({
  label: z.string().nullable(),
});

export type BaseActionData = z.infer<typeof BaseActionData>;

export const Action = <
  Type extends NodeType,
  Data extends z.ZodTypeAny = z.ZodNull,
  Ports extends z.ZodTypeAny = z.ZodNull
>(
  type: Type,
  data: Data = z.null() as Data,
  ports: Ports = z.null() as Ports
) => Node(type, data).merge(NodeChild).merge(NodePorts(ports));

export type Action<Type extends NodeType, Data = null, Ports extends Record<string, Port> | null = null> = z.infer<
  ReturnType<typeof Action<Type, z.ZodType<Data>, z.ZodType<Ports>>>
>;
