import React from 'react';

import { styled } from '@/hocs';

interface StickerProps {
  url: string;
  position?: string;
}

const Image = styled.div<StickerProps>`
  width: 100%;
  height: 100%;

  border-radius: 6px;
  background: ${({ url, position = 'center center' }) => `url(${url}) no-repeat ${position}`};
  background-size: contain;
`;

const ImageContainer = styled.div`
  display: flex;

  width: 90px;
  height: 90px;

  cursor: pointer;

  :hover {
    transform: scale(1.1);
    transition: transform 0.2s ease-in-out;
  }
`;

const Sticker: React.FC<StickerProps> = ({ url }) => {
  return (
    <ImageContainer>
      <Image url={url} />
    </ImageContainer>
  );
};

export default Sticker;
