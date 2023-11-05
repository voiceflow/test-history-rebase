import { z } from 'zod';

import { CardDTO } from './card.dto';
import { TraceDTOFactory, TraceType } from './utils.dto';

export enum CarouselLayout {
  CAROUSEL = 'Carousel',
  LIST = 'List',
}

export const CarouselTraceDTO = TraceDTOFactory(TraceType.CAROUSEL, {
  payload: z.object({
    layout: z.nativeEnum(CarouselLayout),
    cards: z.array(CardDTO),
  }),
});

export type CarouselTrace = z.infer<typeof CarouselTraceDTO>;
