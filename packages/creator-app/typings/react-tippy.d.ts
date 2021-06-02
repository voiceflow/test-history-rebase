import 'react-tippy';

declare module 'react-tippy' {
  interface Tooltip {
    tooltipDOM: HTMLElement | null;
  }
}
