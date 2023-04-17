import RCSlider, { SliderProps } from 'rc-slider';
import React from 'react';

import { styled } from '@/hocs/styled';

const StyledSlider = styled(RCSlider as React.FC<SliderProps<number>>)`
  margin-right: 8px;

  .rc-slider-track {
    background-image: linear-gradient(to bottom, rgba(93, 157, 245, 0.85), #2c85ff), linear-gradient(to bottom, #fff, #fff);
  }
  .rc-slider-handle {
    border: solid 5px white !important;
    opacity: 1;
    width: 16px;
    height: 16px;
    margin-top: -6px;
    background-image: linear-gradient(to bottom, rgba(93, 157, 245, 0.85), #2c85ff), linear-gradient(to bottom, #fff, #fff);
    box-shadow: 0 2px 3px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.08) !important;
  }
`;

export default StyledSlider;
