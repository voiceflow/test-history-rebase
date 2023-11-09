import { z } from 'zod';

import { SlateTextValueDTO } from '../text/text.dto';
import { TraceType } from './trace-type.enum';
import { BaseTraceDTO, ButtonDTO } from './utils.dto';

export const CardTraceCardDTO = z
  .object({
    title: z.string(),
    buttons: z.array(ButtonDTO),
    imageUrl: z.string().nullable(),
    description: z.object({
      text: z.string(),
      // slate is optional, but text is required
      slate: SlateTextValueDTO.optional(),
    }),
  })
  .partial();

export const CardTraceDTO = BaseTraceDTO.extend({
  type: z.literal(TraceType.CARD_V2),
  payload: CardTraceCardDTO,
});

export type CardTrace = z.infer<typeof CardTraceDTO>;
