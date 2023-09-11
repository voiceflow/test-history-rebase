import type { ExitHandler } from 'react-transition-group/Transition';

export interface IModal {
  type?: string;
  width?: string;
  hidden: boolean;
  opened: boolean;
  stacked?: boolean;
  children: React.ReactNode;
  animated?: boolean;
  onExited?: ExitHandler<HTMLDivElement>;
  className?: string;
  onEscClose?: VoidFunction;
}
