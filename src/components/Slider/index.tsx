import 'rc-slider/assets/index.css';

import React from 'react';

import StyledSlider from './components/StyledSlider';

type SliderProps = {
  min?: number;
  max?: number;
  disabled?: boolean;
  onChange: (val: number) => void;
  value?: number;
  step?: number;
};

const Slider: React.FC<SliderProps> = ({ min = 1, max = 100, disabled, onChange, value = 5, step = 1 }) => {
  return <StyledSlider min={min} max={max} disabled={disabled} onChange={onChange} value={value} step={step} />;
};

export default Slider;
