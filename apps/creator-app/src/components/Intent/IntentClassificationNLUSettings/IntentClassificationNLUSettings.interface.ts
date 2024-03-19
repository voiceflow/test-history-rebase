import { IntentClassificationNLUSettings } from '@voiceflow/dtos';

export interface IIntentClassificationNLUSettings {
  settings: Omit<IntentClassificationNLUSettings, 'type'>;
  disabled?: boolean;
  onSettingsChange: (settings: Omit<IntentClassificationNLUSettings, 'type'>) => void;
}
