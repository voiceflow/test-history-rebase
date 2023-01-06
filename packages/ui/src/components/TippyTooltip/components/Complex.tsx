import React from 'react';

import Multiline from './Multiline';
import Title from './Title';

export interface ComplexProps extends React.PropsWithChildren {
  title?: React.ReactNode;
  width?: number;
}

const Complex: React.FC<ComplexProps> = ({ title, width = 200, children }) => (
  <Multiline width={width}>
    {!!title && <Title>{title}</Title>}

    {children}
  </Multiline>
);

export default Complex;
