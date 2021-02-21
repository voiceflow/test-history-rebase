/* eslint-disable no-nested-ternary */
import React from 'react';

import Box from '@/components/Box';
import { css, styled } from '@/hocs';

export const Outter = styled.div<{ isPublic?: boolean }>`
  position: relative;
  display: flex;
  flex: 1;
  height: 100%;
  padding-top: 0;
  ${({ isPublic }) =>
    isPublic &&
    css`
      max-width: 500px;
    `}
`;

export const Middle = styled.div<{ isPublic?: boolean; showPadding?: boolean; isMobile?: boolean }>`
  position: absolute;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0 24px 20px;
  padding-top: ${({ showPadding, isMobile }) => (showPadding ? (isMobile ? '20px' : '40px') : 0)};

  ${({ isPublic }) =>
    isPublic &&
    css`
      padding-top: 20px;
    `}

  ${({ isMobile }) =>
    isMobile &&
    css`
      justify-content: flex-end;
      padding-bottom: 0;
    `}
`;

const Container: React.FC<{ isPublic?: boolean; showPadding?: boolean; isMobile?: boolean }> = ({ children, isPublic, showPadding, isMobile }) => (
  <Outter isPublic={isPublic}>
    <Middle isPublic={isPublic} showPadding={showPadding} isMobile={isMobile}>
      <Box pb={20} width="100%">
        {children}
      </Box>
    </Middle>
  </Outter>
);

export default Container;
