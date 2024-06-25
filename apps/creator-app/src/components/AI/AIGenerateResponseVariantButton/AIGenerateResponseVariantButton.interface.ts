import type { IAIGenerateHoverableButton } from '../AIGenerateHoverableButton/AIGenerateHoverableButton.interface';

export interface IAIGenerateResponseVariantButton
  extends Omit<IAIGenerateHoverableButton, 'label' | 'quantities' | 'pluralLabel'> {
  hasExtraContext?: boolean;
}
