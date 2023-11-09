import { z } from 'zod';

export const UtteranceTextEntityReferenceDTO = z.object({ entityID: z.string().uuid() }).strict();
export type UtteranceTextEntityReference = z.infer<typeof UtteranceTextEntityReferenceDTO>;

export const UtteranceTextSpanDTO = z.object({ attributes: z.record(z.any()).optional() }).strict();
export type UtteranceTextSpan = z.infer<typeof UtteranceTextSpanDTO> & { text: UtteranceText };

export type UtteranceText = Array<string | UtteranceTextEntityReference | UtteranceTextSpan>;
export const UtteranceTextDTO: z.ZodType<UtteranceText> = z
  .union([
    z.string(),
    UtteranceTextEntityReferenceDTO,
    UtteranceTextSpanDTO.extend({ text: z.lazy(() => UtteranceTextDTO) }).strict(),
  ])
  .array();
