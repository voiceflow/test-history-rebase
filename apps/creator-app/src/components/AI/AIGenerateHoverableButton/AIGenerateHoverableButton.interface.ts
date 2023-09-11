import type { IAIGenerateBaseButton } from '../AIGenerateBaseButton/AIGenerateBaseButton.interface';

export interface IAIGenerateHoverableButton extends Omit<IAIGenerateBaseButton, 'options' | 'hoverOpen'> {
  label: string;
  onGenerate: (options: { quantity: number }) => void;
  quantities?: number[];
  pluralLabel: string;
}
