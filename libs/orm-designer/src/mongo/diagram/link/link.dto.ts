import { z } from 'zod';

import { LinkType } from './link-type.enum';

export const LinkCaption = z.object({
  text: z.string(),
  width: z.number(),
  height: z.number(),
});

export type LinkCaption = z.infer<typeof LinkCaption>;

export const LinkPoint = z.object({
  point: z.tuple([z.number(), z.number()]),
  toTop: z.boolean().optional(),
  locked: z.boolean().optional(),
  reversed: z.boolean().optional(),
  allowedToTop: z.boolean().optional(),
});

export type LinkPoint = z.infer<typeof LinkPoint>;

export const Link = z.object({
  type: z.nativeEnum(LinkType).nullable(),
  nodeID: z.string(),
  color: z.string().nullable(),
  caption: LinkCaption.nullable(),
  points: LinkPoint.array().nullable(),
});

export type Link = z.infer<typeof Link>;
