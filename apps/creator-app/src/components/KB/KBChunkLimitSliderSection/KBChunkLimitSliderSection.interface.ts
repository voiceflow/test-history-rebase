import type { IKBChunkLimitSlider } from '../KBChunkLimitSlider/KBChunkLimitSlider.interface';

export interface IKBChunkLimitSliderSection extends Omit<IKBChunkLimitSlider, 'onValueSave'> {
  learnMoreURL: string;
}
