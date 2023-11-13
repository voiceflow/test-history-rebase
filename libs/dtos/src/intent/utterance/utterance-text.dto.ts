import { z } from 'zod';

export const UtteranceTextEntityReferenceDTO = z.object({ entityID: z.string() }).strict();
export type UtteranceTextEntityReference = z.infer<typeof UtteranceTextEntityReferenceDTO>;

export interface UtteranceTextSpan {
  text: UtteranceText;
  attributes?: Record<string, unknown>;
}

export const UtteranceTextSpanDTO: z.ZodType<UtteranceTextSpan> = z
  .object({ text: z.lazy(() => UtteranceTextDTO), attributes: z.record(z.unknown()).optional() })
  .strict();

export type UtteranceText = Array<string | UtteranceTextEntityReference | UtteranceTextSpan>;
export const UtteranceTextDTO: z.ZodType<UtteranceText> = z
  .union([z.string(), UtteranceTextEntityReferenceDTO, UtteranceTextSpanDTO])
  .array();
