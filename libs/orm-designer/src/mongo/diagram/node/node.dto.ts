import { z } from 'zod';

import { Port } from '../port/port.dto';
import { PortType } from '../port/port-type.enum';
import type { NodeType } from './node-type.enum';

export const Node = <Type extends NodeType, Data extends z.ZodTypeAny>(type: Type, data: Data) =>
  z.object({
    id: z.string(),
    type: z.literal(type),
    data,
  });

export type Node<Type extends NodeType, Data extends z.ZodTypeAny> = z.infer<ReturnType<typeof Node<Type, Data>>>;

export const NodeChild = z.object({
  parentID: z.string(),
});

export type NodeChild = z.infer<typeof NodeChild>;

export const NodeCoordinates = z.object({
  coords: z.tuple([z.number(), z.number()]),
});

export const NodePorts = <Ports extends z.ZodTypeAny>(ports: Ports) => z.object({ ports });

export type NodePorts<Ports extends z.ZodTypeAny> = z.infer<ReturnType<typeof NodePorts<Ports>>>;

export const NodePortsWithNext = z.object({ [PortType.NEXT]: Port });
export const NodePortsByKey = z.record(Port);
