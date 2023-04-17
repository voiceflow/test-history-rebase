import * as Realtime from '@voiceflow/realtime-sdk';
import {
  COLOR_PICKER_CONSTANTS,
  colorGetReadableAlfa,
  colorReadableAlfaToOpacity,
  preventDefault,
  useDidUpdateEffect,
  useToggle,
} from '@voiceflow/ui';
import React from 'react';
import { unstable_batchedUpdates } from 'react-dom';

import ColorSelect from '@/components/ColorSelect';
import SliderInputGroup from '@/components/SliderInputGroup';
import { NUMBERS_ONLY_REGEXP } from '@/constants';
import { withEnterPress } from '@/utils/dom';

import { DEFAULT_COLOR, TextProperty } from '../constants';
import { useSlateEditor } from '../contexts';
import { EditorAPI } from '../editor';

const TextColor: React.FC = () => {
  const editor = useSlateEditor();

  const color = EditorAPI.textProperty(editor, TextProperty.COLOR, DEFAULT_COLOR);
  const [pickerInputFocused, togglePickerInputFocused] = useToggle();

  const [inputOpacity, setInputOpacity] = React.useState(() => colorGetReadableAlfa(color));

  const setColor = (nextColor: Realtime.Markup.Color) => {
    EditorAPI.setTextProperty(editor, TextProperty.COLOR, nextColor);
  };

  const onChangeColor = (nextColor: Realtime.Markup.Color) => {
    setInputOpacity(`${nextColor.a * 100}`);
    setColor(nextColor);
  };

  const onChangeOpacitySlider = (value: number) => {
    const opacity = value / 100;

    setInputOpacity(`${value}`);
    setColor({ ...color, a: opacity });
  };

  const onChangeOpacityInput = ({ value }: HTMLInputElement) => {
    if (value === '') {
      setInputOpacity(value);
      setColor({ ...color, a: 0 });
    } else if (value.match(NUMBERS_ONLY_REGEXP)) {
      const opacity = colorReadableAlfaToOpacity(value);
      setInputOpacity(`${opacity * 100}`);
      setColor({ ...color, a: opacity });
    }
  };

  const onBlurOpacityInput = ({ target }: React.FocusEvent<HTMLInputElement>) => {
    unstable_batchedUpdates(() => {
      if (!editor.isFakeSelectionApplied()) {
        editor.removeFakeSelection();
      } else {
        EditorAPI.removeFakeSelectionAndFocus(editor);
      }

      onChangeOpacityInput(target);
    });
  };

  const onEnterPressOpacityInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.currentTarget?.blur();
  };

  const onPickerInputFocus = () => {
    togglePickerInputFocused(true);

    editor.applyFakeSelection();
  };

  const onPickerInputBlur = () => {
    unstable_batchedUpdates(() => {
      togglePickerInputFocused(false);

      if (!editor.isFakeSelectionApplied()) {
        editor.removeFakeSelection();
      } else {
        EditorAPI.removeFakeSelectionAndFocus(editor);
      }
    });
  };

  const onPickerContainerMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!pickerInputFocused) {
      event.preventDefault();
    }
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
        onFocus: editor.applyFakeSelection,
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
          onChange={onChangeColor}
          onInputBlur={onPickerInputBlur}
          colorScheme={COLOR_PICKER_CONSTANTS.ColorScheme.DARK}
          onInputFocus={onPickerInputFocus}
          onContainerMouseDown={preventDefault()}
          onPickerPreviewMouseDown={preventDefault()}
          onPickerContainerMouseDown={onPickerContainerMouseDown}
        />
      }
      onChangeInput={({ target }) => onChangeOpacityInput(target)}
      onChangeSlider={onChangeOpacitySlider}
      onSliderContainerMouseDown={preventDefault()}
    />
  );
};

export default TextColor;
