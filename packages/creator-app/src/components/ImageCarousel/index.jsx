import React from 'react';

import { styled } from '@/hocs/styled';
import { DragScroll } from '@/utils/scroll';

const ImageContainer = styled.div`
  margin-right: 20px;
  display: inline-block;
  padding-bottom: 6px;
`;

const Image = styled.img`
  box-shadow: 0px 4px 12px rgba(17, 49, 96, 0.16), 0px 0px 1px rgba(17, 49, 96, 0.18);
  border-radius: 5px;
  height: 250px;
  width: 400px;
`;

const Slider = styled(DragScroll)`
  overflow-y: hidden;
  position: relative;
  white-space: nowrap;
  width: 100%;
  padding: 10px 20px;
`;

function ImageCarousel({ imageURLs = [] }) {
  const sliderRef = React.useRef();

  return (
    <Slider ref={sliderRef}>
      {imageURLs.map((imgUrl, index) => (
        <ImageContainer key={index}>
          <Image src={imgUrl} />
        </ImageContainer>
      ))}
    </Slider>
  );
}

export default ImageCarousel;
