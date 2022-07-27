import { TippyTooltipProps } from '../TippyTooltip';

export interface Props<E extends HTMLElement = HTMLElement> extends TippyTooltipProps {
  overflow?: boolean;
  children: (ref: React.RefObject<E>, options: { isOverflow?: boolean }) => React.ReactNode;
  isChildrenOverflow?: (node: E) => boolean;
}
