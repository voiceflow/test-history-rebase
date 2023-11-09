import type { Markup } from '@voiceflow/dtos';

export interface IIntentRepromptInput {
  value: Markup;
  onValueChange: (newValue: Markup) => void;
  onDelete: () => void;
}
