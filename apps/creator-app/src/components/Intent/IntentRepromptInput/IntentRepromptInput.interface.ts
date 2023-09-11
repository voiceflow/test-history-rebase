import type { Markup } from '@voiceflow/sdk-logux-designer';

export interface IIntentRepromptInput {
  value: Markup;
  onValueChange: (newValue: Markup) => void;
  onDelete: () => void;
}
