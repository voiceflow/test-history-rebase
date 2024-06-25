import { BaseNode } from '@voiceflow/base-types';
import React from 'react';

import type { OnInteraction } from '@/pages/Prototype/types';

import type { BaseMessageProps } from '../../Base';
import CarouselLayout from './CarouselLayout';
import ListLayout from './ListLayout';

type CarouselProps = Omit<BaseMessageProps, 'iconProps'> & {
  cards: BaseNode.Carousel.TraceCarouselCard[];
  onInteraction: OnInteraction;
  layout: BaseNode.Carousel.CarouselLayout;
};

const Carousel: React.FC<CarouselProps> = ({ layout, ...restProps }) => {
  const Component = layout === BaseNode.Carousel.CarouselLayout.LIST ? ListLayout : CarouselLayout;

  return <Component {...restProps} />;
};

export default Carousel;
