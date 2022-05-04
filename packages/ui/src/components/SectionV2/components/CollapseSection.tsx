import { useDidUpdateEffect } from '@ui/hooks';
import { stopPropagation } from '@ui/utils';
import { Utils } from '@voiceflow/common';
import React from 'react';

import Collapse from './Collapse';
import Container from './Container';
import PreventContainerCollapse from './PreventContainerCollapse';

export interface RendererProps {
  onToggle: VoidFunction;
  collapsed: boolean;
}

export interface CollapseSectionProps {
  onToggle?: (collapsed: boolean) => void;
  children?: React.ReactNode | ((props: RendererProps) => React.ReactNode);
  collapsed?: boolean;
  renderHeader: (props: RendererProps) => React.ReactNode;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  containerToggle?: boolean;
  initialCollapsed?: boolean;
}

const CollapseSection: React.FC<CollapseSectionProps> = ({
  onToggle,
  children,
  renderHeader,
  mountOnEnter = true,
  unmountOnExit = true,
  containerToggle,
  initialCollapsed = false,
  collapsed: collapsedProp,
}) => {
  const [collapsed, setCollapsed] = React.useState(collapsedProp ?? initialCollapsed);

  const onClick = () => {
    onToggle?.(!collapsed);
    setCollapsed(!collapsed);
  };

  useDidUpdateEffect(() => setCollapsed(!!collapsedProp), [collapsedProp]);

  const rendererProps = { collapsed, onToggle: onClick };

  return (
    <Container onClick={containerToggle ? onClick : undefined}>
      {renderHeader(rendererProps)}

      <Collapse onClick={stopPropagation()} isOpen={!collapsed} mountOnEnter={mountOnEnter} unmountOnExit={unmountOnExit}>
        {Utils.functional.isFunction(children) ? children(rendererProps) : children}
      </Collapse>

      {containerToggle && !collapsed && <PreventContainerCollapse onClick={stopPropagation()} />}
    </Container>
  );
};

export default CollapseSection;
