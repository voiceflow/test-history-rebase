import type { Markup } from '@voiceflow/dtos';

export interface ICardPopperButtonEditor {
  label: Markup;
  onRemove: VoidFunction;
  onLabelChange: (value: Markup) => void;
}
