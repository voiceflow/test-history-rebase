import { Utils } from '@voiceflow/common';
import React from 'react';

import CollapseSection, { CollapseSectionProps, RendererProps } from './CollapseSection';
import Content from './Content';
import Header from './Header';

type ReactNodeOrRenderer = React.ReactNode | ((props: RendererProps) => React.ReactNode);

export interface ActionCollapseSectionProps extends Omit<CollapseSectionProps, 'onToggle' | 'header' | 'defaultCollapsed'> {
  px?: number;
  title: ReactNodeOrRenderer;
  action: ReactNodeOrRenderer;
  children?: React.ReactNode;
}

const ActionCollapseSection: React.ForwardRefRenderFunction<HTMLDivElement, ActionCollapseSectionProps> = (
  { px, title, action, children, ...collapseProps },
  ref
) => (
  <CollapseSection
    isAccent={false}
    {...collapseProps}
    ref={ref}
    header={(props) => (
      <Header px={px}>
        {Utils.functional.isFunction(title) ? title(props) : title}

        {Utils.functional.isFunction(action) ? action(props) : action}
      </Header>
    )}
  >
    <Content px={px}>{children}</Content>
  </CollapseSection>
);

export default React.forwardRef(ActionCollapseSection);
