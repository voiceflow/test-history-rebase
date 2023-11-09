import { z } from 'zod';

export const MarkupVariableReferenceDTO = z.object({ variableID: z.string().uuid() }).strict();
export type MarkupVariableReference = z.infer<typeof MarkupVariableReferenceDTO>;

export const MarkupEntityReferenceDTO = z.object({ entityID: z.string().uuid() }).strict();
export type MarkupEntityReference = z.infer<typeof MarkupEntityReferenceDTO>;

export const MarkupSpanDTO = z.object({ attributes: z.record(z.any()).optional() }).strict();
export type MarkupSpan = z.infer<typeof MarkupSpanDTO> & { text: Markup };

export type Markup = Array<string | MarkupVariableReference | MarkupEntityReference | MarkupSpan>;
export const MarkupDTO: z.ZodType<Markup> = z
  .union([
    z.string(),
    MarkupVariableReferenceDTO,
    MarkupEntityReferenceDTO,
    MarkupSpanDTO.extend({ text: z.lazy(() => MarkupDTO) }).strict(),
  ])
  .array();
