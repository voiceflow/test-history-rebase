import IconButton, { IconButtonVariant } from '@ui/components/IconButton';
import React from 'react';

import CollapseSection from './CollapseSection';
import Content from './Content';
import Header from './Header';
import Title from './Title';

export interface AddCollapseSectionProps {
  px?: number;
  title: React.ReactNode;
  onAdd?: VoidFunction;
  onRemove?: VoidFunction;
  collapsed?: boolean;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
}

const AddCollapseSection: React.FC<AddCollapseSectionProps> = ({ px, title, onAdd, onRemove, children, collapsed, mountOnEnter, unmountOnExit }) => (
  <CollapseSection
    collapsed={collapsed}
    mountOnEnter={mountOnEnter}
    unmountOnExit={unmountOnExit}
    renderHeader={({ collapsed }) => (
      <Header px={px}>
        <Title bold={!collapsed}>{title}</Title>

        <IconButton size={16} icon={collapsed ? 'plus' : 'minus'} onClick={collapsed ? onAdd : onRemove} variant={IconButtonVariant.BASIC} />
      </Header>
    )}
  >
    <Content px={px}>{children}</Content>
  </CollapseSection>
);

export default AddCollapseSection;
