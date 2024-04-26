import type { ScrollbarProps, Scrollbars as ReactScrollbars } from 'react-custom-scrollbars-2';

export interface Scrollbars extends ReactScrollbars {
  view: HTMLDivElement;
}

export interface Props extends ScrollbarProps {}
