import { z } from 'zod';

export const MarkupVariableReferenceDTO = z.object({ variableID: z.string() }).strict();
export type MarkupVariableReference = z.infer<typeof MarkupVariableReferenceDTO>;

export const MarkupEntityReferenceDTO = z.object({ entityID: z.string() }).strict();
export type MarkupEntityReference = z.infer<typeof MarkupEntityReferenceDTO>;

export interface MarkupSpan {
  text: Markup;
  attributes?: Record<string, unknown>;
}

export const MarkupSpanDTO: z.ZodType<MarkupSpan> = z
  .object({ text: z.lazy(() => MarkupDTO), attributes: z.record(z.unknown()).optional() })
  .strict();

export type Markup = Array<string | MarkupVariableReference | MarkupEntityReference | MarkupSpan>;
export const MarkupDTO: z.ZodType<Markup> = z
  .union([z.string(), MarkupVariableReferenceDTO, MarkupEntityReferenceDTO, MarkupSpanDTO])
  .array();
