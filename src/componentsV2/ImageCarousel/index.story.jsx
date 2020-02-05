import React from 'react';

import { styled } from '@/hocs';

import ImageCarousel from '.';

const CarouselContainer = styled.div`
  width: 500px;
`;

const getProps = () => ({
  imageURLs: Array(4).fill('https://picsum.photos/350/250'),
});

export default {
  title: 'Image Carousel',
  component: ImageCarousel,
  includeStories: [],
};

export const normal = () => (
  <CarouselContainer>
    <ImageCarousel {...getProps()} />
  </CarouselContainer>
);
