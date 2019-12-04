import { storiesOf } from '@storybook/react';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';
import { styled } from '@/hocs';

import ImageCarousel from '.';

const CarouselContainer = styled.div`
  width: 500px;
`;

storiesOf('Image Carousel', module).add(
  'variants',
  createTestableStory(() => {
    const imageURL = 'https://picsum.photos/350/250';
    const imageURLs = [];
    imageURLs.push(imageURL);
    imageURLs.push(imageURL);
    imageURLs.push(imageURL);
    imageURLs.push(imageURL);
    return (
      <>
        <Variant label="normal">
          <CarouselContainer>
            <ImageCarousel imageUrls={imageURLs} />
          </CarouselContainer>
        </Variant>
      </>
    );
  })
);
