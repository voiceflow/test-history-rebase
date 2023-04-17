import React from 'react';

import Container, { ContainerProps } from './Container';
import Header, { HeaderProps } from './Header';

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
