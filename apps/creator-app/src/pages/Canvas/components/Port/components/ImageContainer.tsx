import React from 'react';

import { css, styled } from '@/hocs/styled';

import PortContainer from './PortContainer';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  height: 46px;
  bottom: 0;
  left: 0;
  right: 0;

  ${PortContainer} {
    width: 46px;
    height: 46px;
    right: 0px;
    bottom: 0px;
    position: absolute;
  }
`;

const Background = styled.div<{ borderRadius?: number }>`
  position: absolute;

  background-color: #fff;
  width: 46px;
  height: 46px;

  right: 0px;
  bottom: 0px;

  ${({ borderRadius = 5 }) => css`
    border-top-left-radius: ${borderRadius}px;
    border-bottom-right-radius: ${borderRadius}px;

    &:before {
      width: ${borderRadius * 2}px;
      height: ${borderRadius}px;

      position: absolute;
      left: ${-borderRadius * 2}px;
      bottom: 2px;

      box-shadow: ${borderRadius}px 1px 0 0 #fff;
      border-bottom-right-radius: ${borderRadius}px;

      content: '';
    }

    &:after {
      width: ${borderRadius}px;
      height: ${borderRadius * 2}px;

      position: absolute;
      top: ${-borderRadius * 2}px;
      right: 2px;

      box-shadow: 1px ${borderRadius}px 0 0 #fff;
      border-bottom-right-radius: ${borderRadius}px;

      content: '';
    }
  `}
`;

const ImageContainer: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Container>
    <Background />

    {children}
  </Container>
);

export default ImageContainer;
