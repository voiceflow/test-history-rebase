import { Box, Input, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import Slider, { SliderProps } from '@/components/Slider';

export interface SliderInputGroupProps {
  value: number;
  onChange: (value: number) => void;
  inputWidth?: number;
  inputProps?: Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange' | 'onBlur' | 'variant'>;
  sliderProps?: Omit<SliderProps, 'value' | 'onChange' | 'onBlur'>;
  inputAction?: React.ReactNode;
  textModifier?: (value: number) => string;
}

const SliderInputGroup: React.FC<SliderInputGroupProps> = ({
  value,
  onChange,
  inputWidth = 128,
  inputProps,
  sliderProps,
  textModifier = (value: number) => String(value),
}) => {
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const [localValue, setLocalValue] = useLinkedState(value);
  const [localInputValue, setLocalInputValue] = useLinkedState(textModifier(value));

  const updateSlider = (nextValue: number) => {
    sliderRef.current?.focus();
    setLocalValue(nextValue);
    setLocalInputValue(textModifier(nextValue));
  };

  // changes to input do not affect slider, on commit (blur) we apply the value
  const updateInput = (temp: string) => {
    setLocalInputValue(temp.replace(/[^\d.]/g, ''));
  };

  const applyValue = (next: number | string) => {
    let nextValue = +next;
    if (!nextValue) nextValue = sliderProps?.min ?? 0;
    if (sliderProps?.min) nextValue = Math.max(sliderProps.min, nextValue);
    if (sliderProps?.max) nextValue = Math.min(sliderProps.max, nextValue);

    setLocalValue(nextValue);
    setLocalInputValue(textModifier(nextValue));
    onChange(nextValue);
  };

  return (
    <Box.Flex gap={16}>
      <Slider ref={sliderRef} {...sliderProps} value={localValue} onChange={updateSlider} onBlur={() => applyValue(localInputValue)} />
      <Box width={inputWidth}>
        <Input {...inputProps} value={localInputValue} onChangeText={updateInput} onBlur={() => applyValue(localInputValue)} />
      </Box>
    </Box.Flex>
  );
};

export default SliderInputGroup;
