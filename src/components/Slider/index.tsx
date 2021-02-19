import 'rc-slider/assets/index.css';

import RCSlider from 'rc-slider';
import React from 'react';

import StyledSlider from './components/StyledSlider';

export type SliderProps = React.ComponentProps<typeof RCSlider>;

const Slider: React.FC<SliderProps> = ({ min = 1, max = 100, value = 0, step = 1, ...props }) => (
  <StyledSlider min={min} max={max} value={value} step={step} {...props} />
);

export default Slider;
