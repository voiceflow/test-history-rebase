import { styled } from '@ui/styles';
import React from 'react';

import Multiline from './Multiline';
import Title from './Title';

export interface ComplexProps {
  title?: React.ReactNode;
  width?: number;
  buttonText: string;
  onClick: () => void;
}

const Component = styled.div`
  padding: 10px 70px;
  border-radius: 6px;
  background-color: #4b5052;
  position: absolute;
  bottom: 6px;
  width: calc(100% - 10px);
  text-align: center;
  left: 5px;
  color: white;
  pointer-events: auto;
  cursor: pointer;
`;
const FooterButton: React.FC<ComplexProps> = ({ onClick, buttonText, title, width = 200, children }) => (
  <Multiline width={width} style={{ paddingBottom: '40px' }}>
    {!!title && <Title>{title}</Title>}

    {children}
    <Component onClick={onClick}>{buttonText}</Component>
  </Multiline>
);

export default FooterButton;
