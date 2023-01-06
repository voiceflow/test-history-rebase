import 'rc-slider/assets/index.css';

import { SliderProps as RCSliderProps } from 'rc-slider';
import React from 'react';

import StyledSlider from './components/StyledSlider';

export interface SliderProps extends RCSliderProps<number> {}

const Slider: React.FC<SliderProps> = ({ min = 1, max = 100, value = 0, step = 1, ...props }) => (
  <StyledSlider min={min} max={max} value={value} step={step} {...props} />
);

export default Slider;
