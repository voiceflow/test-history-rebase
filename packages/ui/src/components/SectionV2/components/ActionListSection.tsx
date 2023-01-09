import React from 'react';

import Container, { ContainerProps } from './Container';
import Content, { ContentProps } from './Content';
import Header, { HeaderProps } from './Header';
import Sticky from './Sticky';

export interface ActionListSectionProps extends ContainerProps {
  title: React.ReactNode;
  action: React.ReactNode;
  sticky?: boolean;
  headerProps?: Omit<HeaderProps, 'sticky' | 'sticked'>;
  contentProps?: ContentProps;
}

const ActionListSection: React.FC<ActionListSectionProps> = ({ title, children, action, sticky, headerProps, contentProps, ...containerProps }) => (
  <Sticky disabled={!sticky}>
    {({ sticked }) => (
      <Container {...containerProps}>
        <Header {...headerProps} sticky={sticky} sticked={sticked}>
          {title}

          {action}
        </Header>

        {!!children && <Content {...contentProps}>{children}</Content>}
      </Container>
    )}
  </Sticky>
);

export default ActionListSection;
