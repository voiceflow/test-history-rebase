import composeRef from '@seznam/compose-react-refs';
import React from 'react';

import Divider from './Divider';
import type { PanelContainerProps } from './PanelContainer';
import PanelContainer from './PanelContainer';
import PanelContent from './PanelContent';

export interface PanelProps extends PanelContainerProps, Omit<React.ComponentProps<'div'>, 'ref' | 'children'> {
  children?: (options: { collapsed: boolean; setHeight: (height: number) => void }) => React.ReactNode;
}

export interface PanelPropsInjected extends PanelProps {
  innerRef: (node: HTMLDivElement | null) => void;
  collapsed: boolean;
  setHeight: (height: number) => void;
  withDivider?: boolean;
  renderDivider?: (props: { onDividerMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void }) => React.ReactNode;
  onDividerMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Panel = (
  {
    innerRef,
    children,
    setHeight,
    collapsed,
    withDivider,
    renderDivider = ({ onDividerMouseDown }) => <Divider onMouseDown={onDividerMouseDown} />,
    onDividerMouseDown,
    ...props
  }: PanelPropsInjected,
  ref: React.Ref<HTMLDivElement>
) => (
  <PanelContainer ref={composeRef(ref, innerRef)} {...props}>
    {withDivider && renderDivider({ onDividerMouseDown })}

    <PanelContent>{children?.({ collapsed, setHeight })}</PanelContent>
  </PanelContainer>
);

export default React.forwardRef(Panel) as React.ForwardRefExoticComponent<
  PanelProps & React.RefAttributes<HTMLDivElement>
>;
