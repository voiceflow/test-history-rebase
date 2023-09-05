import type { UtteranceText } from '@voiceflow/sdk-logux-designer';

export interface IIntentUtteranceInput {
  value: UtteranceText;
  autoFocus?: boolean;
  placeholder?: string;
  onValueEmpty?: (isEmpty: boolean) => void;
  onValueChange: (value: UtteranceText) => void;
}
