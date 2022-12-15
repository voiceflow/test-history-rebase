import { keyframes, styled } from '@ui/styles';
import React from 'react';

import { Container, Line } from './components';
import * as T from './types';

const slideIn = keyframes`
  from {
    background-position: 0px 0;
  }
  to {
    background-position: 100em 0;
  }
`;

const GradientContainer = styled.div`
  div {
    animation-duration: 30s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: ${slideIn};
    animation-timing-function: cubic-bezier(0.4, 0, 1, 1);
    background: linear-gradient(to right, rgb(238 238 238 / 0%) 0%, rgb(255 255 255 / 40%) 18%, rgb(238 238 238 / 0%) 100%);
    backface-visibility: hidden;
    background-color: #dfe3ed;
    height: 2px;
  }
`;

const Spinner: React.FC<T.Props> = ({ width = 100, thickness = 2, background }) => {
  return (
    <Container title="Loading" distance={8}>
      <GradientContainer>
        <Line width={width} thickness={thickness} background={background}></Line>
      </GradientContainer>
    </Container>
  );
};

export default Spinner;
