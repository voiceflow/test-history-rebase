import React from 'react';

import Container, { ContainerProps } from './Container';
import Content from './Content';
import Header from './Header';
import Sticky from './Sticky';

export interface ActionListSectionProps extends ContainerProps {
  title: React.ReactNode;
  action: React.ReactNode;
  sticky?: boolean;
}

const ActionListSection: React.FC<ActionListSectionProps> = ({ title, children, action, sticky, ...containerProps }) => (
  <Sticky disabled={!sticky}>
    {({ sticked }) => (
      <Container {...containerProps}>
        <Header sticky={sticky} sticked={sticked}>
          {title}

          {action}
        </Header>

        {!!children && <Content topOffset>{children}</Content>}
      </Container>
    )}
  </Sticky>
);

export default ActionListSection;
