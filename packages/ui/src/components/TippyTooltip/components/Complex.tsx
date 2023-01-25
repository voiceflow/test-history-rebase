import React from 'react';

import Multiline from './Multiline';
import Title from './Title';

export interface ComplexProps extends React.PropsWithChildren {
  title?: React.ReactNode;
}

const Complex: React.FC<ComplexProps> = ({ title, children }) => (
  <Multiline>
    {!!title && <Title>{title}</Title>}

    {children}
  </Multiline>
);

export default Complex;
