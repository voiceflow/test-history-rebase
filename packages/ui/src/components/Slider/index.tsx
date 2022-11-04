import 'rc-slider/assets/index.css';

import { styled } from '@ui/styles';
import RCSlider from 'rc-slider';
import React from 'react';

const SliderContainer = styled(RCSlider)`
  margin-right: 8px;

  .rc-slider-dot-active {
    border-color: #2c85ff;
  }

  .rc-slider-dot-active {
    bottom: 0px;
    margin-left: 0px;
    width: 4px;
    height: 4px;
  }

  .rc-slider-track {
    background-image: linear-gradient(to bottom, rgba(93, 157, 245, 0.85), #2c85ff), linear-gradient(to bottom, #fff, #fff);
  }

  .rc-slider-handle {
    border: solid 6px white !important;
    width: 16px;
    height: 16px;
    margin-top: -6px;
    background-image: linear-gradient(to bottom, rgba(93, 157, 245, 0.85), #2c85ff), linear-gradient(to bottom, #fff, #fff);
    box-shadow: 0 2px 3px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.08) !important;
  }
`;

export type SliderProps = React.ComponentProps<typeof RCSlider>;

const Slider: React.FC<SliderProps> = ({ min = 1, max = 100, value = 0, step = 1, ...props }) => (
  <SliderContainer min={min} max={max} value={value} step={step} {...props} />
);

export default Slider;
