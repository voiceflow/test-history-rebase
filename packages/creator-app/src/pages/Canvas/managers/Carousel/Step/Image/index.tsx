import React from 'react';

import ImagePopper from './Popper';
import * as S from './styles';

export interface CardStepV2ImageProps {
  imageUrl: string | null;
}

const CardStepV2Image: React.FC<CardStepV2ImageProps> = ({ imageUrl }) => (
  <S.Container>
    {imageUrl ? (
      <ImagePopper imageUrl={imageUrl}>
        <S.Image src={imageUrl} />
      </ImagePopper>
    ) : (
      <S.Placeholder />
    )}
  </S.Container>
);
export default CardStepV2Image;
