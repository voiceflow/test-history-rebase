import React from 'react';
import styled from 'styled-components';

import Spinner, { SpinnerProps } from './Spinner';

type DiagramProps = {
  isAbs?: boolean;
  zIndex?: number;
  backgroundColor?: string;
};

const Diagram = styled.div<DiagramProps>`
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

export type FullSpinnerProps = SpinnerProps & DiagramProps;

const FullSpinner: React.FC<FullSpinnerProps> = (props) => (
  <Diagram backgroundColor={props.backgroundColor} zIndex={props.zIndex}>
    <Spinner {...props} />
  </Diagram>
);

export default FullSpinner;
