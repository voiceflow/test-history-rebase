import { Utils } from '@voiceflow/common';
import React from 'react';

import type { CollapseSectionProps, RendererProps } from './CollapseSection';
import CollapseSection from './CollapseSection';
import type { ContentProps } from './Content';
import Content from './Content';
import type { HeaderProps } from './Header';
import Header from './Header';

type ReactNodeOrRenderer = React.ReactNode | ((props: RendererProps) => React.ReactNode);

export interface ActionCollapseSectionProps
  extends Omit<CollapseSectionProps, 'onToggle' | 'header' | 'defaultCollapsed'> {
  title: ReactNodeOrRenderer;
  action: ReactNodeOrRenderer;
  children?: React.ReactNode;
  headerProps?: HeaderProps;
  contentProps?: ContentProps;
}

const ActionCollapseSection: React.ForwardRefRenderFunction<HTMLDivElement, ActionCollapseSectionProps> = (
  { title, action, children, headerProps, contentProps, ...collapseProps },
  ref
) => (
  <CollapseSection
    isAccent={false}
    {...collapseProps}
    ref={ref}
    header={(props) => (
      <Header {...headerProps}>
        {Utils.functional.isFunction(title) ? title(props) : title}

        {Utils.functional.isFunction(action) ? action(props) : action}
      </Header>
    )}
  >
    <Content {...contentProps}>{children}</Content>
  </CollapseSection>
);

export default React.forwardRef(ActionCollapseSection);
