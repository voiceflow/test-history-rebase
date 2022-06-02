import { Popper } from '@voiceflow/ui';
import React from 'react';

import { useHover } from '@/hooks';

import * as S from './styles';

interface CardStepV2ImagePopper {
  imageUrl: string;
}

const CardStepV2ImagePopper: React.FC<CardStepV2ImagePopper> = ({ children, imageUrl }) => {
  const [isHovered, , hoverHandlers] = useHover();

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

export default CardStepV2ImagePopper;
