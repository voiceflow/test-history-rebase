import { css, styled } from '@ui/styles';
import RCSlider, { SliderProps as RCSliderProps } from 'rc-slider';
// can's just use import '...index.css' cause vite-node will crash
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _globalRCStyles from 'rc-slider/assets/index.css';
import React from 'react';

interface SliderProps extends RCSliderProps<number> {
  color?: string;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const RCSliderFixed: React.FC<SliderProps> = RCSlider.default ?? RCSlider;

const DEFAULT_SLIDER_COLOR = 'linear-gradient(to bottom, rgba(93, 157, 245, 0.85), #2c85ff), linear-gradient(to bottom, #fff, #fff)';

const getBackgroundColor = (color?: string) => {
  if (!color)
    return css`
      background-image: ${DEFAULT_SLIDER_COLOR};
    `;
  return css`
    background-color: ${color};
  `;
};

const SliderContainer = styled(RCSliderFixed)`
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
    ${({ color }) => getBackgroundColor(color)};
  }

  .rc-slider-handle {
    border: solid 6px white !important;
    width: 16px;
    height: 16px;
    margin-top: -6px;
    box-shadow: 0 2px 3px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.08) !important;
    ${({ color }) => getBackgroundColor(color)};
    opacity: 1;
  }
`;

const Slider: React.FC<SliderProps> = ({ min = 1, max = 100, value = 0, step = 1, color, ...props }) => (
  <SliderContainer min={min} max={max} value={value} step={step} color={color} {...props} />
);

export default Slider;
