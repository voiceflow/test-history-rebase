import React from 'react';

import Box from '@/components/Box';
import { css, styled } from '@/hocs';

export const Outter = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  max-width: 500px;
  height: 100%;
  padding-top: 0;
`;

export const Middle = styled.div<{ isPublic?: boolean }>`
  position: absolute;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0 24px 20px;
  ${({ isPublic }) =>
    isPublic &&
    css`
      padding-top: 20px;
    `}
`;

const Container: React.FC<{ isPublic?: boolean }> = ({ children, isPublic }) => {
  return (
    <Outter>
      <Middle isPublic={isPublic}>
        <Box pb={20} width="100%">
          {children}
        </Box>
      </Middle>
    </Outter>
  );
};

export default Container;
