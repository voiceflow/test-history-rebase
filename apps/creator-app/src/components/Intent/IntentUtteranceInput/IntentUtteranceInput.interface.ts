import type { UtteranceText } from '@voiceflow/dtos';

export interface IIntentUtteranceInput {
  value: UtteranceText;
  error?: string | null;
  autoFocus?: boolean;
  placeholder?: string;
  onValueEmpty?: (isEmpty: boolean) => void;
  onEnterPress?: React.KeyboardEventHandler<HTMLDivElement>;
  onValueChange: (value: UtteranceText) => void;
}
