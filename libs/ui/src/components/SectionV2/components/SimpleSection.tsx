import React from 'react';

import type { ContainerProps } from './Container';
import Container from './Container';
import type { HeaderProps } from './Header';
import Header from './Header';

export interface SimpleSectionProps extends ContainerProps {
  style?: React.CSSProperties;
  onClick?: VoidFunction;
  headerProps?: HeaderProps;
}

const SimpleSection: React.FC<SimpleSectionProps> = ({ onClick, children, headerProps, style, ...containerProps }) => (
  <Container onClick={onClick} {...containerProps} style={style}>
    <Header bottomUnit={2.5} {...headerProps}>
      {children}
    </Header>
  </Container>
);

export default SimpleSection;
