import React from 'react';

import Slider, { SliderProps } from '@/components/Slider';

import FormGroup from '../FormGroup';
import { Input, InputAction, SliderPrefixContainer } from './components';

export type SliderInputGroupProps = {
  inputValue: string;
  inputProps?: Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange' | 'rightAction'>;
  sliderValue: number;
  sliderProps?: Omit<SliderProps, 'value' | 'onChange'>;
  inputAction?: React.ReactNode;
  sliderPrefix: React.ReactNode;
  onChangeInput: React.ChangeEventHandler<HTMLInputElement>;
  onChangeSlider: (value: number) => void;
};

const SliderInputGroup: React.FC<SliderInputGroupProps> = ({
  inputValue,
  inputProps,
  sliderProps,
  sliderValue,
  inputAction,
  sliderPrefix,
  onChangeInput,
  onChangeSlider,
}) => (
  <FormGroup
    leftColumn={
      <>
        <SliderPrefixContainer>{sliderPrefix}</SliderPrefixContainer>
        <Slider {...sliderProps} value={sliderValue} onChange={onChangeSlider} />
      </>
    }
    rightColumn={
      <Input {...inputProps} value={inputValue} onChange={onChangeInput} rightAction={inputAction && <InputAction>{inputAction}</InputAction>} />
    }
  />
);

export default SliderInputGroup;
