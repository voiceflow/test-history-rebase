import { z } from 'zod';

import { ZodType } from './zod-type';

const VariableReference = z.object({ variableID: z.string().uuid() }).strict();
type VariableReference = z.infer<typeof VariableReference>;

const EntityReference = z.object({ entityID: z.string().uuid() }).strict();
type EntityReference = z.infer<typeof EntityReference>;

export const MarkupSpan = z.object({ attributes: z.record(z.any()).optional() }).strict();
export type MarkupSpan = z.infer<typeof MarkupSpan> & { text: Markup };

export type Markup = Array<string | VariableReference | EntityReference | MarkupSpan>;
export const Markup: z.ZodType<Markup> = z
  .union([z.string(), VariableReference, EntityReference, MarkupSpan.extend({ text: z.lazy(() => Markup) })])
  .array();

export const MarkupType = new ZodType(Markup);
