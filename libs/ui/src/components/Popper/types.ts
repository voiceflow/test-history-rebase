import type { PopperProps as ReactPopperProps } from '@voiceflow/legacy-react-popper';
import type React from 'react';
import type { DismissEventType } from 'react-dismissable-layers';

export interface BaseRendererProps {
  onClose: VoidFunction;
  isOpened: boolean;
  onToggle: VoidFunction;
}

export interface RendererProps extends BaseRendererProps {
  scheduleUpdate: VoidFunction;
}

export interface ChildrenProps extends BaseRendererProps {
  ref: React.Ref<any>;
  popper: React.ReactNode;
}

export type Renderer = (props: RendererProps) => React.ReactNode;

export type Children = (props: ChildrenProps) => React.ReactNode;

export type Modifiers = ReactPopperProps['modifiers'];

export type Placement = ReactPopperProps['placement'];

export interface Props {
  width?: string | number;
  height?: string | number;
  zIndex?: number;
  opened?: boolean;
  /**
   * inline is useful if we wanna handle popper's react events in the trigger component
   */
  inline?: boolean;
  onClose?: VoidFunction;
  onOpen?: VoidFunction;
  preventClose?: (event?: Event) => boolean;
  maxWidth?: string | number;
  maxHeight?: string | number;
  children?: Children;
  renderNav?: Renderer;
  modifiers?: Modifiers;
  placement?: Placement;
  portalNode?: HTMLElement;
  initialTab?: string;
  dismissEvent?: DismissEventType;
  renderFooter?: Renderer;
  renderContent: Renderer;
  disableLayers?: boolean;
  initialOpened?: boolean;
  onContainerClick?: (event: React.MouseEvent) => void;
  preventOverflowPadding?: number;
  testID?: string;
}
