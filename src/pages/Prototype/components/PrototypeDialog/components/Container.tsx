/* eslint-disable no-nested-ternary */
import React from 'react';

import { css, styled } from '@/hocs';

export const Outter = styled.div<{ isPublic?: boolean; withInteractions?: boolean }>`
  position: relative;
  display: flex;
  flex: 1;
  height: ${({ withInteractions }) => `calc(100% + ${withInteractions ? 50 : 0}px)`};
  padding-top: 0;
  ${({ isPublic }) =>
    isPublic &&
    css`
      max-width: 500px;
    `}
`;

export const Middle = styled.div<{ showPadding?: boolean; isMobile?: boolean }>`
  position: absolute;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;

  ${({ isMobile }) =>
    isMobile &&
    css`
      justify-content: flex-end;
    `}
`;

const Content = styled.div<{ showPadding?: boolean; isMobile?: boolean }>`
  width: 100%;

  padding-top: ${({ showPadding, isMobile }) => (showPadding ? (isMobile ? '20px' : '40px') : 0)};
  padding-bottom: 20px;
  padding-left: 24px;
  padding-right: 24px;

  overflow-y: ${({ isMobile }) => (isMobile ? 'scroll' : 'auto')};
  -webkit-overflow-scrolling: touch;
`;

const Container: React.FC<{ isPublic?: boolean; showPadding?: boolean; isMobile?: boolean; withInteractions?: boolean }> = ({
  children,
  isPublic,
  showPadding,
  withInteractions,
  isMobile,
}) => (
  <Outter isPublic={isPublic} withInteractions={withInteractions}>
    <Middle isMobile={isMobile}>
      <Content showPadding={showPadding} isMobile={isMobile} className="chat-dialog-content">
        {children}
      </Content>
    </Middle>
  </Outter>
);

export default Container;
