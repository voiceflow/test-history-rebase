import 'react-tippy';

declare module 'react-tippy' {
  // tippy props ant type are incorrect, so fixing it

  export interface TooltipProps {
    onShow?: VoidFunction;
    onHide?: VoidFunction;
  }

  interface Tooltip extends Tooltip {
    hideTooltip: VoidFunction;
  }
}
