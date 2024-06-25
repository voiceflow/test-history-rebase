import type { IPopper } from '@voiceflow/ui-next/build/cjs/components/Utility/Popper/Popper.interface';

export interface IPopperConfirm<Modifiers> extends Omit<IPopper<Modifiers>, 'children'> {
  onCancel?: VoidFunction;
  children?: React.ReactNode;
  onConfirm: VoidFunction;
  cancelLabel?: string;
  confirmLabel?: string;
}
