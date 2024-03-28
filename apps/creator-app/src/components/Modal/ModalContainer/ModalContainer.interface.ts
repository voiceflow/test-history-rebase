import { BaseProps } from '@voiceflow/ui-next';
import type { ExitHandler } from 'react-transition-group/Transition';

export interface IModalContainer extends BaseProps {
  type?: string;
  width?: string;
  hidden: boolean;
  opened: boolean;
  stacked?: boolean;
  children: React.ReactNode;
  animated?: boolean;
  onExited?: ExitHandler<HTMLDivElement>;
  onExiting?: ExitHandler<HTMLDivElement>;
  className?: string | string[];
  onEscClose?: VoidFunction;
  onEnterSubmit?: VoidFunction;
  containerClassName?: string;
}
