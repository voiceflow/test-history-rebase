import React from 'react';

import * as S from './styles';

const Container: React.FC<
  React.PropsWithChildren<{
    isPublic?: boolean;
    showPadding?: boolean;
    isMobile?: boolean;
    onScroll?: (e: React.UIEvent<HTMLDivElement, UIEvent>) => void;
  }>
> = ({ children, isPublic, showPadding, isMobile, onScroll }) => {
  return (
    <S.Outer isPublic={isPublic}>
      <S.Middle isMobile={isMobile}>
        <S.Content onScroll={onScroll} showPadding={showPadding} isMobile={isMobile} className="chat-dialog-content">
          {children}
        </S.Content>
      </S.Middle>
    </S.Outer>
  );
};

export default Container;
