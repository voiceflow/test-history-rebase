import React from 'react';

import Popper from '@/components/Popper';
import { useHover } from '@/hooks';

import * as S from './styles';

interface ThumbnailPopperProps extends React.PropsWithChildren {
  imageUrl: string;
}

const ThumbnailPopper: React.FC<ThumbnailPopperProps> = ({ children, imageUrl }) => {
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
