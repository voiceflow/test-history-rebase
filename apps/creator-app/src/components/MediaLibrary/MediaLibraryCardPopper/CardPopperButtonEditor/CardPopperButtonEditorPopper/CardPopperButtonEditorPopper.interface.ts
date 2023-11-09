import type { Markup } from '@voiceflow/dtos';
import type { IPopper } from '@voiceflow/ui-next/build/cjs/components/Utility/Popper/Popper.interface';

export interface ICardPopperButtonEditorPopper extends Omit<IPopper<unknown>, 'children'> {
  label: Markup;
  onLabelChange: (label: Markup) => void;
}
