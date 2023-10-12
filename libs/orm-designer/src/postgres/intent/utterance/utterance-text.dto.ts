import { z } from 'zod';

import { ZodType } from '@/common';

const EntityReference = z.object({ entityID: z.string().uuid() }).strict();
type EntityReference = z.infer<typeof EntityReference>;

export const UtteranceSpan = z.object({ attributes: z.record(z.any()).optional() }).strict();
export type UtteranceSpan = z.infer<typeof UtteranceSpan> & { text: UtteranceText };

export type UtteranceText = Array<string | EntityReference | UtteranceSpan>;
export const UtteranceText: z.ZodType<UtteranceText> = z
  .union([z.string(), EntityReference, UtteranceSpan.extend({ text: z.lazy(() => UtteranceText) })])
  .array();

export const UtteranceTextType = new ZodType(UtteranceText);
