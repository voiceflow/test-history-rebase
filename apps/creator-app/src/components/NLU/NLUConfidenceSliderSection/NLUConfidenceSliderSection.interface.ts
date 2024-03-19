import { INLUConfidenceSlider } from '../NLUConfidenceSlider/NLUConfidenceSlider.interface';

export interface INLUConfidenceSliderSection extends Omit<INLUConfidenceSlider, 'onValueSave'> {
  learnMoreURL: string;
}
