import { Tooltip } from 'react-tippy';

declare module 'react-tippy' {
  // eslint-disable-next-line import/prefer-default-export
  export class TooltipWithRef extends Tooltip {
    public tooltipDOM: HTMLElement | null;
  }
}
