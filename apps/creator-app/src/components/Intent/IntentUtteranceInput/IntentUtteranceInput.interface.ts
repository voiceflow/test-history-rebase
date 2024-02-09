import type { UtteranceText } from '@voiceflow/dtos';
import { BaseProps } from '@voiceflow/ui-next';

export interface IIntentUtteranceInput extends BaseProps {
  value: UtteranceText;
  error?: string | null;
  autoFocus?: boolean;
  placeholder?: string;
  onValueEmpty?: (isEmpty: boolean) => void;
  onEnterPress?: (event: React.KeyboardEvent<HTMLDivElement>, value: UtteranceText) => void;
  onValueChange: (value: UtteranceText) => void;
  onEntityAdded?: (entityID: string) => void;
}
