import type { DraftJsBlockStyleButtonProps } from '@voiceflow/draft-js-buttons';
import { EditorState } from 'draft-js';
import { parseToRgb } from 'polished';
import { RgbaColor } from 'polished/lib/types/color';
import React from 'react';
import { unstable_batchedUpdates } from 'react-dom';

import ColorSelect from '@/components/ColorSelect';
import SliderInputGroup from '@/components/SliderInputGroup';
import { useDidUpdateEffect } from '@/hooks';
import { Markup } from '@/models';

import { InlineStylePrefix } from '../constants';
import { getInlineStylePrefixAndValue, togglePrefixedInlineStyle } from '../utils';

export type TextColorProps = Omit<DraftJsBlockStyleButtonProps, 'children'> & {
  saveEditorState: (state: EditorState) => void;
  applyFakeSelection: (state: EditorState) => EditorState;
  removeFakeSelection: (state: EditorState) => EditorState;
};

const DEFAULT_COLOR = 'rgba(19,33,68,1)';

const getStrColor = ({ r, g, b, a }: Markup.Color) => `rgba(${r},${g},${b},${a})`;

const getRGBAColor = (str: string) => {
  const { red, green, blue, alpha } = parseToRgb(str) as RgbaColor;

  return {
    r: red,
    g: green,
    b: blue,
    a: alpha ?? 1,
  };
};

const TextColor: React.FC<TextColorProps> = ({ getEditorState, setEditorState, saveEditorState, applyFakeSelection, removeFakeSelection }) => {
  const colorStr = React.useMemo(() => {
    const editorState = getEditorState?.();

    if (!editorState) {
      return DEFAULT_COLOR;
    }

    let color = DEFAULT_COLOR;

    const inlineStyle = editorState.getCurrentInlineStyle();

    inlineStyle.some((style) => {
      const [prefix, value] = getInlineStylePrefixAndValue(style);

      if (prefix === InlineStylePrefix.COLOR) {
        color = value!;
        return true;
      }

      return false;
    });

    return color;
  }, [getEditorState?.()]);

  const [color, setColor] = React.useState(() => getRGBAColor(colorStr));
  const [inputOpacity, setInputOpacity] = React.useState(`${color.a * 100}`);

  const updateEditorColor = (nextColor: Markup.Color) => {
    let state = getEditorState();

    state = togglePrefixedInlineStyle(state, InlineStylePrefix.COLOR, getStrColor(nextColor));

    setEditorState(state);

    return state;
  };

  const onChangeColor = (nextColor: Markup.Color) => {
    unstable_batchedUpdates(() => {
      updateEditorColor(nextColor);
      setColor(nextColor);
      setInputOpacity(`${nextColor.a * 100}`);
    });
  };

  const onChangeOpacitySlider = (value: number) => {
    const opacity = value / 100;

    unstable_batchedUpdates(() => {
      updateEditorColor({ ...color, a: opacity });
      setColor({ ...color, a: opacity });
      setInputOpacity(`${value}`);
    });
  };

  const onChangeOpacityInput = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    unstable_batchedUpdates(() => {
      if (value === '') {
        updateEditorColor({ ...color, a: 0 });
        setColor({ ...color, a: 0 });
        setInputOpacity(value);
      } else if (value.match(/^\d+$/)) {
        const opacity = Math.min(+value / 100, 1);

        updateEditorColor({ ...color, a: opacity });
        setColor({ ...color, a: opacity });
        setInputOpacity(`${opacity * 100}`);
      }
    });
  };

  const onApplyFakeSelection = () => {
    setEditorState(applyFakeSelection(getEditorState()));
  };

  const onRemoveAndSaveFakeSelection = () => {
    const state = removeFakeSelection(getEditorState());

    setEditorState(state);
    saveEditorState(state);
  };

  const onBlurOpacityInput = () => {
    unstable_batchedUpdates(() => {
      onRemoveAndSaveFakeSelection();

      if (inputOpacity === '') {
        setInputOpacity(`${color.a * 100}`);
      }
    });
  };

  useDidUpdateEffect(() => {
    if (getStrColor(color) !== colorStr) {
      const nextColor = getRGBAColor(colorStr);

      unstable_batchedUpdates(() => {
        setColor(nextColor);
        setInputOpacity(`${(nextColor.a ?? 1) * 100}`);
      });
    }
  }, [colorStr]);

  return (
    <SliderInputGroup
      inputValue={inputOpacity}
      inputProps={{ placeholder: '100', onFocus: onApplyFakeSelection, onBlur: onBlurOpacityInput }}
      sliderValue={+inputOpacity}
      inputAction="%"
      sliderProps={{ min: 0, onBeforeChange: onApplyFakeSelection, onAfterChange: onRemoveAndSaveFakeSelection }}
      sliderPrefix={<ColorSelect color={color} onChange={onChangeColor} onShow={onApplyFakeSelection} onClose={onRemoveAndSaveFakeSelection} />}
      onChangeInput={onChangeOpacityInput}
      onChangeSlider={onChangeOpacitySlider}
    />
  );
};

export default TextColor;
