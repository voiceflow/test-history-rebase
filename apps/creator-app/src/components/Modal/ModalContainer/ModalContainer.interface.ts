import type { ExitHandler } from 'react-transition-group/Transition';

export interface IModalContainer {
  type?: string;
  width?: string;
  hidden: boolean;
  opened: boolean;
  stacked?: boolean;
  children: React.ReactNode;
  animated?: boolean;
  onExited?: ExitHandler<HTMLDivElement>;
  onExiting?: ExitHandler<HTMLDivElement>;
  className?: string;
  containerClassName?: string;
  onEscClose?: VoidFunction;
  onEnterSubmit?: VoidFunction;
}
