import React from 'react';

import { styled } from '@/hocs';

const Outter = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  max-width: 500px;
  height: 100%;
  overflow-x: hidden;
`;

const Middle = styled.div`
  position: absolute;
  display: flex;
  flex: 1;
  flex-direction: column-reverse;
  width: 100%;
  height: 100%;
  padding: 0 20px 20px 20px;
  overflow-x: hidden;
`;

const Inner = styled.div`
  width: 100%;
`;

const Container: React.FC = ({ children }) => {
  return (
    <Outter>
      <Middle>
        <Inner>{children}</Inner>
      </Middle>
    </Outter>
  );
};

export default Container;
