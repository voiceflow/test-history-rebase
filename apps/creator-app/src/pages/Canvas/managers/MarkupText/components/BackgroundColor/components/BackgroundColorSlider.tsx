import type * as Realtime from '@voiceflow/realtime-sdk';
import {
  colorGetReadableAlfa,
  colorReadableAlfaToOpacity,
  preventDefault,
  useDidUpdateEffect,
  useToggle,
} from '@voiceflow/ui';
import React from 'react';

import ColorSelect from '@/components/ColorSelect';
import SliderInputGroup from '@/components/SliderInputGroup';
import { NUMBERS_ONLY_REGEXP } from '@/constants';
import { withEnterPress } from '@/utils/dom';

export interface BackgroundColorSliderProps {
  color: Realtime.Markup.Color;
  onChangeColor: (color: Realtime.Markup.Color) => void;
}

const BackgroundColorSlider: React.FC<BackgroundColorSliderProps> = ({ color, onChangeColor }) => {
  const [pickerInputFocused, togglePickerInputFocused] = useToggle();

  const [inputOpacity, setInputOpacity] = React.useState(() => colorGetReadableAlfa(color));

  const handleChangeColor = (nextColor: Realtime.Markup.Color) => {
    setInputOpacity(`${nextColor.a * 100}`);
    onChangeColor(nextColor);
  };

  const onChangeOpacitySlider = (value: number) => {
    const opacity = value / 100;

    setInputOpacity(`${value}`);
    onChangeColor({ ...color, a: opacity });
  };

  const onChangeOpacityInput = ({ value }: HTMLInputElement) => {
    if (value === '') {
      setInputOpacity(value);
      onChangeColor({ ...color, a: 0 });
    } else if (value.match(NUMBERS_ONLY_REGEXP)) {
      const opacity = colorReadableAlfaToOpacity(value);
      setInputOpacity(`${opacity * 100}`);
      onChangeColor({ ...color, a: opacity });
    }
  };

  const onBlurOpacityInput = ({ target }: React.FocusEvent<HTMLInputElement>) => {
    onChangeOpacityInput(target);
  };

  const onEnterPressOpacityInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.currentTarget?.blur();
  };

  const onPickerInputFocus = () => {
    togglePickerInputFocused(true);
  };

  const onPickerInputBlur = () => {
    togglePickerInputFocused(false);
  };

  const onPickerContainerMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!pickerInputFocused) {
      event.preventDefault();
    }
  };

  const onSliderContainerMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  useDidUpdateEffect(() => {
    if (colorGetReadableAlfa(color) !== inputOpacity) {
      setInputOpacity(colorGetReadableAlfa(color));
    }
  }, [color]);

  return (
    <SliderInputGroup
      inputValue={inputOpacity}
      inputProps={{
        onBlur: onBlurOpacityInput,
        placeholder: '100',
        onKeyPress: withEnterPress(onEnterPressOpacityInput),
      }}
      sliderValue={+inputOpacity}
      inputAction="%"
      sliderProps={{
        min: 0,
        onBlur: preventDefault(),
        onFocus: preventDefault(),
        autoFocus: false,
        handleRender: (origin: React.ReactElement<React.ComponentProps<'div'>>) =>
          React.cloneElement(origin, {
            onMouseDown: preventDefault(origin.props.onMouseDown),
            onTouchStart: preventDefault(origin.props.onTouchStart),
          }),
      }}
      sliderPrefix={
        <ColorSelect
          color={color}
          onChange={handleChangeColor}
          onInputBlur={onPickerInputBlur}
          onInputFocus={onPickerInputFocus}
          onPickerPreviewMouseDown={preventDefault()}
          onPickerContainerMouseDown={onPickerContainerMouseDown}
        />
      }
      onChangeInput={({ target }) => onChangeOpacityInput(target)}
      onChangeSlider={onChangeOpacitySlider}
      onSliderContainerMouseDown={onSliderContainerMouseDown}
    />
  );
};

export default BackgroundColorSlider;
