import { z } from 'zod';

import { NodePortLinkType } from './node-port-link-type.enum';
import { NodeSystemPortType } from './node-system-port-type.enum';

export const NodePortLinkDataCaptionDTO = z
  .object({
    value: z.string(),
    width: z.number(),
    height: z.number(),
  })
  .strict();

export type NodePortLinkDataCaption = z.infer<typeof NodePortLinkDataCaptionDTO>;

export const NodePortLinkDataPathDTO = z
  .object({
    point: z.tuple([z.number(), z.number()]),
    toTop: z.boolean().nullable().optional(),
    locked: z.boolean().nullable().optional(),
    reversed: z.boolean().nullable().optional(),
    allowedToTop: z.boolean().nullable().optional(),
  })
  .strict();

export type NodePortLinkDataPath = z.infer<typeof NodePortLinkDataPathDTO>;

export const NodePortLinkDataDTO = z
  .object({
    type: z.nativeEnum(NodePortLinkType).nullable().optional(),
    color: z.string().nullable().optional(),
    points: z.array(NodePortLinkDataPathDTO).nullable().optional(),
    caption: NodePortLinkDataCaptionDTO.nullable().optional(),
  })
  .strict();

export type NodePortLinkData = z.infer<typeof NodePortLinkDataDTO>;

export const NodePortDTO = z
  .object({
    id: z.string(),
    data: NodePortLinkDataDTO.nullable().optional(),
    type: z.union([z.string(), z.nativeEnum(NodeSystemPortType)]),
    target: z.string().nullable().describe('Id of the node that the port points to'),
  })
  .strict();

export type NodePort = Omit<z.infer<typeof NodePortDTO>, 'type'> & {
  // eslint-disable-next-line @typescript-eslint/ban-types
  type: NodeSystemPortType | (string & {});
};
