import { z } from 'zod';

import { CarouselLayout } from '@/node/carousel/carousel-layout.enum';

import { CardTraceCardDTO } from './card.dto';
import { TraceType } from './trace-type.enum';
import { BaseTraceDTO } from './utils.dto';

export const CarouselTraceDTO = BaseTraceDTO.extend({
  type: z.literal(TraceType.CAROUSEL),
  payload: z.object({
    cards: z.array(CardTraceCardDTO),
    layout: z.nativeEnum(CarouselLayout),
  }),
});

export type CarouselTrace = z.infer<typeof CarouselTraceDTO>;
