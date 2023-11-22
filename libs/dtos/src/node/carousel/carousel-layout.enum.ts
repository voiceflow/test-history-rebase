import type { Enum } from '@/utils/type/enum.util';

export const CarouselLayout = {
  LIST: 'List',
  CAROUSEL: 'Carousel',
} as const;

export type CarouselLayout = Enum<typeof CarouselLayout>;
