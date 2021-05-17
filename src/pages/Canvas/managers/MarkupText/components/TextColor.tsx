import React from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { Editor } from 'slate';

import ColorSelect from '@/components/ColorSelect';
import SliderInputGroup from '@/components/SliderInputGroup';
import { useDidUpdateEffect, useToggle } from '@/hooks';
import { Markup } from '@/models';
import { preventDefault, withEnterPress } from '@/utils/dom';

import { DEFAULT_COLOR, TextProperty } from '../constants';
import MarkupSlateEditor from '../MarkupSlateEditor';
import OpacitySliderHandle from './OpacitySliderHandle';

export interface TextColorProps {
  editor: Editor;
}

const colorAlfaToString = (color: Markup.Color) => `${(color?.a ?? 1) * 100}`;

const TextColor: React.FC<TextColorProps> = ({ editor }) => {
  const color = MarkupSlateEditor.textProperty(editor, TextProperty.COLOR) || DEFAULT_COLOR;
  const [pickerInputFocused, togglePickerInputFocused] = useToggle();

  const [inputOpacity, setInputOpacity] = React.useState(() => colorAlfaToString(color));

  const setColor = (nextColor: Markup.Color) => {
    MarkupSlateEditor.setTextProperty(editor, TextProperty.COLOR, nextColor);
  };

  const onChangeColor = (nextColor: Markup.Color) => {
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
    } else if (value.match(/^\d+$/)) {
      const opacity = Math.min(+value / 100, 1);

      setInputOpacity(`${opacity * 100}`);
      setColor({ ...color, a: opacity });
    }
  };

  const onBlurOpacityInput = ({ target }: React.FocusEvent<HTMLInputElement>) => {
    unstable_batchedUpdates(() => {
      if (!editor.getFakeSelectionRange()) {
        editor.removeFakeSelection();
      } else {
        MarkupSlateEditor.removeFakeSelectionAndFocus(editor);
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

      if (!editor.getFakeSelectionRange()) {
        editor.removeFakeSelection();
      } else {
        MarkupSlateEditor.removeFakeSelectionAndFocus(editor);
      }
    });
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
    if (colorAlfaToString(color) !== inputOpacity) {
      setInputOpacity(colorAlfaToString(color));
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
      sliderProps={{ min: 0, autoFocus: false, handle: OpacitySliderHandle }}
      sliderPrefix={
        <ColorSelect
          color={color}
          onChange={onChangeColor}
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

export default TextColor;
