import React from 'react';

import type { Color } from '@/components/ColorPicker';
import { useDebouncedCallback } from '@/hooks';
import { ColorSelect, Section, SliderInputGroup } from '@/pages/Canvas/components/MarkupComponents';

import { UPDATE_DATA_TIMEOUT } from '../constants';

type ColorSectionProps = {
  max?: number;
  color: Color | null;
  title?: string;
  isLast?: boolean;
  onChange: (color: Color | null) => void;
  removable?: boolean;
  inputAction?: React.ReactNode;
};

const DEFAULT_COLOR = { r: 93, g: 157, b: 245, a: 0.2 };

const ColorSection: React.FC<ColorSectionProps> = ({ max = 100, color, title, isLast, onChange, removable = true, inputAction = '%' }) => {
  const [localColor, setLocalColor] = React.useState(color);
  const [inputOpacity, setInputOpacity] = React.useState(color ? `${color.a * 100}` : '');

  const onChangeRef = React.useRef(onChange);

  onChangeRef.current = onChange;

  const onChangeDebounced = useDebouncedCallback(UPDATE_DATA_TIMEOUT, (nextColor: Color | null) => onChangeRef.current(nextColor), []);

  const onChangeColor = (nextColor: Color | null) => {
    setLocalColor(nextColor);
    setInputOpacity(nextColor ? `${nextColor.a * 100}` : '');
    onChange(nextColor);
  };

  const onChangeOpacitySlider = (value: number) => {
    const opacity = value / 100;

    setLocalColor((prevColor) => ({ ...prevColor!, a: opacity }));
    setInputOpacity(`${value}`);
    onChangeDebounced({ ...color!, a: opacity });
  };

  const onChangeOpacityInput = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    if (value === '') {
      setLocalColor((prevColor) => ({ ...prevColor!, a: 0 }));
      setInputOpacity(value);
    } else if (value.match(/^\d+$/)) {
      const opacity = Math.min(+value / 100, 1);

      setLocalColor((prevColor) => ({ ...prevColor!, a: opacity }));
      setInputOpacity(`${opacity * 100}`);
      onChangeDebounced({ ...color!, a: opacity });
    }
  };

  const onBlurOpacityInput = () => {
    if (inputOpacity === '') {
      setInputOpacity(`${color!.a * 100}`);
    }
  };

  return (
    <Section
      title={title}
      isLast={isLast}
      opened={removable && !!localColor}
      onAddRemove={removable ? () => onChangeColor(localColor ? null : DEFAULT_COLOR) : undefined}
    >
      <SliderInputGroup
        inputValue={inputOpacity}
        inputProps={{ placeholder: '100', onBlur: onBlurOpacityInput }}
        sliderValue={+inputOpacity}
        inputAction={inputAction}
        sliderProps={{ min: 0, max }}
        sliderPrefix={<ColorSelect color={localColor ?? DEFAULT_COLOR} onChange={onChangeColor} />}
        onChangeInput={onChangeOpacityInput}
        onChangeSlider={onChangeOpacitySlider}
      />
    </Section>
  );
};

export default ColorSection;
