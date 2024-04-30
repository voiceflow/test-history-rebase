import { Utils } from '@voiceflow/common';
import React from 'react';

import { useDidUpdateEffect } from '@/hooks';

import Collapse from './Collapse';
import type { ContainerProps } from './Container';
import Container from './Container';

export interface RendererProps {
  onToggle: VoidFunction;
  collapsed: boolean;
}

type ReactNodeOrRenderer = React.ReactNode | ((props: RendererProps) => React.ReactNode);

export interface CollapseSectionProps extends Omit<ContainerProps, 'children'> {
  header: ReactNodeOrRenderer;
  onToggle?: (collapsed: boolean) => void;
  children?: ReactNodeOrRenderer;
  disabled?: boolean;
  collapsed?: boolean;
  onEntered?: VoidFunction;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  preventAccent?: boolean;
  containerToggle?: boolean;
  defaultCollapsed?: boolean;
}

const CollapseSection: React.ForwardRefRenderFunction<HTMLDivElement, CollapseSectionProps> = (
  {
    header,
    onToggle: onToggleProp,
    disabled,
    children,
    onEntered,
    mountOnEnter = true,
    unmountOnExit = true,
    preventAccent,
    containerToggle,
    defaultCollapsed = false,
    collapsed: collapsedProp,
    ...containerProps
  },
  ref
) => {
  const preventRef = React.useRef(false);
  const [collapsed, setCollapsed] = React.useState(collapsedProp ?? defaultCollapsed);

  const onToggle = () => {
    if (disabled) return;

    onToggleProp?.(!collapsed);
    setCollapsed(!collapsed);
  };

  const onClick = () => {
    // prevent collapse if clicked inside the container
    if (preventRef.current) {
      preventRef.current = false;
      return;
    }

    onToggle();
  };

  const onPreventCollapseClick = () => {
    preventRef.current = true;
  };

  useDidUpdateEffect(() => setCollapsed(!!collapsedProp), [collapsedProp]);

  const rendererProps = { collapsed, onToggle };

  return (
    <Container
      isCollapse
      isAccent={!preventAccent && !collapsed}
      {...containerProps}
      ref={ref}
      onClick={containerToggle ? onClick : undefined}
    >
      {Utils.functional.isFunction(header) ? header(rendererProps) : header}

      <Collapse
        onEntered={onEntered}
        isOpen={!collapsed}
        onClick={onPreventCollapseClick}
        mountOnEnter={mountOnEnter}
        unmountOnExit={unmountOnExit}
      >
        {Utils.functional.isFunction(children) ? children(rendererProps) : children}
      </Collapse>
    </Container>
  );
};

export default React.forwardRef(CollapseSection);
