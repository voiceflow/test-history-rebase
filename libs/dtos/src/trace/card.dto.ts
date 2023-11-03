import { z } from 'zod';

import { SlateTextValueDTO } from '../text';
import { ButtonDTO, TraceDTOFactory, TraceType } from './utils.dto';

export const CardDescriptionDTO = z.object({
  text: z.string(),
  // slate is optional, but text is required
  slate: SlateTextValueDTO.optional(),
});

export const CardDTO = z
  .object({
    title: z.string(),
    buttons: z.array(ButtonDTO),
    imageUrl: z.string().nullable(),
    description: CardDescriptionDTO,
  })
  .partial();

export const CardTraceDTO = TraceDTOFactory({ type: TraceType.CARD_V2, payload: CardDTO });

export type CardTrace = z.infer<typeof CardTraceDTO>;
