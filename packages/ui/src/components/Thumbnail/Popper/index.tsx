import Popper from '@ui/components/Popper';
import { useHover } from '@ui/hooks';
import React from 'react';

import * as S from './styles';

interface ThumbnailPopperProps {
  imageUrl: string;
}

const ThumbnailPopper: React.OldFC<ThumbnailPopperProps> = ({ children, imageUrl }) => {
  const { isHovered, hoverHandlers } = useHover();

  return (
    <Popper placement="right-start" opened={isHovered} renderContent={() => <S.Image src={imageUrl} />}>
      {({ ref }) => (
        <div ref={ref} {...hoverHandlers}>
          {children}
        </div>
      )}
    </Popper>
  );
};

export default ThumbnailPopper;
