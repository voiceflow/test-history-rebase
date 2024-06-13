import { AIModel } from '@voiceflow/dtos';

export interface IAIMaxTokensSlider {
  model: AIModel;
  value: number;
  testID?: string;
  disabled?: boolean;
  // callback called only after moving a thumb has ended. The callback
  onValueSave: (value: number) => void;
  onValueChange: (value: number) => void;
}

export interface IAIMaxTokensWithLimitSlider extends IAIMaxTokensSlider {
  limit: number;
}
