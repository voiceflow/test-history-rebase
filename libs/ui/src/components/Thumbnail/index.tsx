import React from 'react';

import ThumnailPopper from './Popper';
import * as S from './styles';

export interface ThumbnailProps extends S.ContainerProps, Partial<S.BaseFrameStylesProps> {
  src?: string | null;
}

const Thumbnail: React.FC<ThumbnailProps> = ({ src, size = 'sm', ...containerProps }) => (
  <S.Container {...containerProps}>
    {src ? (
      <ThumnailPopper imageUrl={src}>
        <S.Image src={src} size={size} />
      </ThumnailPopper>
    ) : (
      <S.Placeholder size={size} />
    )}
  </S.Container>
);
export default Thumbnail;
