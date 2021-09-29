import React from 'react';

import Divider from './Divider';
import PanelContainer, { PanelContainerProps } from './PanelContainer';
import PanelContent from './PanelContent';

export interface PanelProps extends PanelContainerProps {
  children: (options: { collapsed: boolean; setHeight: (height: number) => void }) => React.ReactNode;
}

export interface PanelPropsInjected extends PanelProps {
  collapsed: boolean;
  setHeight: (height: number) => void;
  withDivider?: boolean;
  onDividerMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Panel = ({ children, setHeight, collapsed, withDivider, onDividerMouseDown, ...props }: PanelPropsInjected, ref: React.Ref<HTMLDivElement>) => (
  <PanelContainer ref={ref} {...props}>
    {withDivider && <Divider onMouseDown={onDividerMouseDown} />}

    <PanelContent>{children({ collapsed, setHeight })}</PanelContent>
  </PanelContainer>
);

export default React.forwardRef(Panel) as React.ForwardRefExoticComponent<PanelProps> & React.RefAttributes<HTMLDivElement>;
