import type { IAITemperatureSlider } from '../AITemperatureSlider/AITemperatureSlider.interface';

export interface IAITemperatureSliderSection extends Omit<IAITemperatureSlider, 'onValueSave'> {
  learnMoreURL: string;
}
