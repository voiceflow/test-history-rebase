import { IAIMaxTokensSlider } from '../AIMaxTokensSlider/AIMaxTokensSlider.interface';

export interface IAIMaxTokensSliderSection extends Omit<IAIMaxTokensSlider, 'onValueSave'> {
  learnMoreURL: string;
}
