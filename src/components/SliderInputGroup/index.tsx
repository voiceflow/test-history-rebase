import React from 'react';

import FormGroup from '@/components/FormGroup';
import Slider, { SliderProps } from '@/components/Slider';

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
  onAfterChangeSlider?: (value: number) => void;
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
  onAfterChangeSlider,
}) => (
  <FormGroup
    leftColumn={
      <>
        <SliderPrefixContainer>{sliderPrefix}</SliderPrefixContainer>
        <Slider {...sliderProps} value={sliderValue} onChange={onChangeSlider} onAfterChange={onAfterChangeSlider} />
      </>
    }
    rightColumn={
      <Input {...inputProps} value={inputValue} onChange={onChangeInput} rightAction={inputAction && <InputAction>{inputAction}</InputAction>} />
    }
  />
);

export default SliderInputGroup;
