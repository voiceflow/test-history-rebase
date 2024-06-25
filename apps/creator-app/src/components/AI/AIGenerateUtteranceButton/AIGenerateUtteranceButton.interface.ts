import type { IAIGenerateHoverableButton } from '../AIGenerateHoverableButton/AIGenerateHoverableButton.interface';

export interface IAIGenerateUtteranceButton
  extends Omit<IAIGenerateHoverableButton, 'label' | 'quantities' | 'pluralLabel'> {
  hasExtraContext: boolean;
}
