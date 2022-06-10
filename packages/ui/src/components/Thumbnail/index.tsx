import React from 'react';

import ThumnailPopper from './Popper';
import * as S from './styles';

export interface ThumbnailProps {
  src: string | null;
}

const Thumbnail: React.FC<ThumbnailProps> = ({ src }) => (
  <S.Container>
    {src ? (
      <ThumnailPopper imageUrl={src}>
        <S.Image src={src} />
      </ThumnailPopper>
    ) : (
      <S.Placeholder />
    )}
  </S.Container>
);
export default Thumbnail;
