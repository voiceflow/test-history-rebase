export const CarouselLayout = {
  LIST: 'List',
  CAROUSEL: 'Carousel',
} as const;

export type CarouselLayout = (typeof CarouselLayout)[keyof typeof CarouselLayout];
