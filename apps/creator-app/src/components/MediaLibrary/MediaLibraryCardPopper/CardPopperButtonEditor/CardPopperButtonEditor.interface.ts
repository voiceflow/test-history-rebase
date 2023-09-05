import type { Markup } from '@voiceflow/sdk-logux-designer';

export interface ICardPopperButtonEditor {
  label: Markup;
  onRemove: VoidFunction;
  onLabelChange: (value: Markup) => void;
}
