import type { IAIGenerateHoverableButton } from '../AIGenerateHoverableButton/AIGenerateHoverableButton.interface';

export interface IAIGenerateEntityVariant extends Omit<IAIGenerateHoverableButton, 'label' | 'pluralLabel'> {
  hasExtraContext: boolean;
}
