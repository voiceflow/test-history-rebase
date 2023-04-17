import { styled } from '@ui/styles';
import React from 'react';

import Spinner, { SpinnerProps } from './Spinner';

interface ContainerProps {
  isAbs?: boolean;
  zIndex?: number | string;
  backgroundColor?: string;
}

const Container = styled.div<ContainerProps>`
  position: ${({ isAbs }) => (isAbs ? 'absolute' : 'fixed')};
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${(props) => props.zIndex || 6};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.backgroundColor || 'initial'};
`;

export interface FullSpinnerProps extends SpinnerProps, ContainerProps {}

const FullSpinner: React.FC<FullSpinnerProps> = (props) => (
  <Container backgroundColor={props.backgroundColor} zIndex={props.zIndex} isAbs={props.isAbs}>
    <Spinner {...props} />
  </Container>
);

export default FullSpinner;
