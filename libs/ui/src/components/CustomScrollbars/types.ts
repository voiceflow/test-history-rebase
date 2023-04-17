import { ScrollbarProps, Scrollbars as ReactScrollbars } from 'react-custom-scrollbars';

export interface Scrollbars extends ReactScrollbars {
  view: HTMLDivElement;
}

export interface Props extends ScrollbarProps {}
