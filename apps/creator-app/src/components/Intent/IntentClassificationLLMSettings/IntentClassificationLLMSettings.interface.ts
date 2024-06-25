import type { IntentClassificationLLMSettings } from '@voiceflow/dtos';

export interface IIntentClassificationLLMSettings {
  settings: Omit<IntentClassificationLLMSettings, 'type'>;
  disabled?: boolean;
  onSettingsChange: (settings: Omit<IntentClassificationLLMSettings, 'type'>) => void;
  onCodeEditorToggle?: (opened: boolean) => void;
}
