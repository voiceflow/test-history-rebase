import type { BaseProps } from '@voiceflow/ui-next';

interface ModalHeaderMoreOption extends BaseProps {
  name: string;
  onClick: VoidFunction;
  disabled?: boolean;
}

export interface IModalHeaderMore extends BaseProps {
  width?: number;
  options: ModalHeaderMoreOption[];
}
