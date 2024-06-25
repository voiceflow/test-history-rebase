import { Box } from '@voiceflow/ui';
import React from 'react';

import FormGroup from '@/components/FormGroup';
import type { SliderProps } from '@/components/Slider';
import Slider from '@/components/Slider';

import { Input, InputAction, SliderPrefixContainer } from './components';

export interface SliderInputGroupProps {
  inputValue: string;
  inputProps?: Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange' | 'rightAction'>;
  sliderValue: number;
  sliderProps?: Omit<SliderProps, 'value' | 'onChange'>;
  inputAction?: React.ReactNode;
  sliderPrefix: React.ReactNode;
  onChangeInput: React.ChangeEventHandler<HTMLInputElement>;
  onChangeSlider: (value: number) => void;
  onSliderContainerMouseDown?: React.MouseEventHandler<HTMLDivElement>;
}

const SliderInputGroup: React.FC<SliderInputGroupProps> = ({
  inputValue,
  inputProps,
  sliderProps,
  sliderValue,
  inputAction,
  sliderPrefix,
  onChangeInput,
  onChangeSlider,
  onSliderContainerMouseDown,
}) => (
  <FormGroup
    leftColumn={
      <>
        <SliderPrefixContainer>{sliderPrefix}</SliderPrefixContainer>
        <Box pr={4} width="100%" onMouseDown={onSliderContainerMouseDown}>
          <Slider {...sliderProps} value={sliderValue} onChange={onChangeSlider} />
        </Box>
      </>
    }
    rightColumn={
      <Input
        {...inputProps}
        value={inputValue}
        onChange={onChangeInput}
        rightAction={inputAction && <InputAction>{inputAction}</InputAction>}
      />
    }
  />
);

export default SliderInputGroup;
