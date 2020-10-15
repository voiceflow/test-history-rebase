import React from 'react';

import Box from '@/components/Box';
import { styled } from '@/hocs';

export const Outter = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  max-width: 500px;
  height: 100%;
  padding-top: 0;
`;

export const Middle = styled.div`
  position: absolute;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0 24px 20px;
`;

const Container: React.FC = ({ children }) => {
  return (
    <Outter>
      <Middle>
        <Box pb={20} width="100%">
          {children}
        </Box>
      </Middle>
    </Outter>
  );
};

export default Container;
