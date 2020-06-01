import type { DraftJsBlockStyleButtonProps } from '@voiceflow/draft-js-buttons';
import { EditorState } from 'draft-js';
import React from 'react';

import Input from '@/components/Input';
import Select from '@/components/Select';
import { useDidUpdateEffect } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { FormGroup } from '@/pages/Canvas/components/MarkupComponents';
import { withEnterPress } from '@/utils/dom';

import { FONTS_LABELS, FONT_WEIGHTS_LABELS, FONT_WEIGHTS_PER_FONT_FAMILY, Font, FontWeight, InlineStylePrefix } from '../constants';
import { getInlineStylePrefixAndValue, togglePrefixedInlineStyle } from '../utils';

const PartialSelect = Select as React.ComponentType<Partial<React.ComponentProps<typeof Select>>>;

type FontStylesProps = Omit<DraftJsBlockStyleButtonProps, 'children'> & {
  saveEditorState: (state: EditorState) => void;
  applyFakeSelection: (state: EditorState) => EditorState;
  removeFakeSelection: (state: EditorState) => EditorState;
};

const FontStyles: React.FC<FontStylesProps> = ({ getEditorState, setEditorState, saveEditorState, applyFakeSelection, removeFakeSelection }) => {
  const inputRef = React.useRef<HTMLInputElement>();

  const { fontSize, fontWeight, fontFamily } = React.useMemo(() => {
    const editorState = getEditorState?.();

    let fontSizeValue = '20';
    let fontWeightValue = FontWeight.REGULAR;
    let fontFamilyValue = Font.OPEN_SANS;

    if (!editorState) {
      return {
        fontSize: fontSizeValue,
        fontWeight: fontWeightValue,
        fontFamily: fontFamilyValue,
      };
    }

    const inlineStyle = editorState.getCurrentInlineStyle();

    inlineStyle.forEach((style) => {
      const [prefix, value] = getInlineStylePrefixAndValue(style);

      switch (prefix) {
        case InlineStylePrefix.FONT_FAMILY: {
          fontFamilyValue = value! as Font;
          break;
        }
        case InlineStylePrefix.FONT_WEIGHT: {
          fontWeightValue = value! as FontWeight;
          break;
        }
        case InlineStylePrefix.FONT_SIZE: {
          fontSizeValue = value!;
          break;
        }
        default: {
          // empty
        }
      }
    });

    return {
      fontSize: fontSizeValue,
      fontWeight: fontWeightValue,
      fontFamily: fontFamilyValue,
    };
  }, [getEditorState?.()]);

  const [localFontSize, setLocalFontSize] = React.useState(fontSize);

  const onShowFakeSelection = () => {
    setEditorState(applyFakeSelection(getEditorState()));
  };

  const onHideFakeSelection = () => {
    setTimeout(() => {
      setEditorState(removeFakeSelection(getEditorState()));
    }, 100);
  };

  const onChangeFontWeight = (value: FontWeight) => {
    let state = getEditorState();

    state = togglePrefixedInlineStyle(state, InlineStylePrefix.FONT_WEIGHT, value);

    setEditorState(state);
    saveEditorState(state);
  };

  const onChangeFontFamily = (value: Font) => {
    let state = getEditorState();

    state = togglePrefixedInlineStyle(state, InlineStylePrefix.FONT_FAMILY, value);

    if (!FONT_WEIGHTS_PER_FONT_FAMILY[value].includes(fontWeight)) {
      state = togglePrefixedInlineStyle(state, InlineStylePrefix.FONT_WEIGHT, FONT_WEIGHTS_PER_FONT_FAMILY[value][0]);
    }

    setEditorState(state);
    saveEditorState(state);
  };

  const onChangeFontSize = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    if (value === '' || value.match(/^\d+$/)) {
      setLocalFontSize(value);
    }
  };

  const onBlurEnterFontSize = () => {
    inputRef.current?.blur();

    const value = localFontSize === '' ? fontSize : localFontSize;

    let state = getEditorState();

    state = togglePrefixedInlineStyle(state, InlineStylePrefix.FONT_SIZE, value);

    state = removeFakeSelection(state);

    setEditorState(state);
    saveEditorState(state);
  };

  useDidUpdateEffect(() => {
    setLocalFontSize(fontSize);
  }, [fontSize]);

  return (
    <>
      <FormControl>
        <PartialSelect
          value={fontFamily}
          onOpen={onShowFakeSelection}
          onClose={onHideFakeSelection}
          options={Object.values(Font)}
          onSelect={onChangeFontFamily}
          getOptionLabel={(value: Font) => FONTS_LABELS[value]}
        />
      </FormControl>

      <FormGroup
        leftColumn={
          <PartialSelect
            value={fontWeight}
            onOpen={onShowFakeSelection}
            onClose={onHideFakeSelection}
            options={FONT_WEIGHTS_PER_FONT_FAMILY[fontFamily]}
            onSelect={onChangeFontWeight}
            getOptionLabel={(value: FontWeight) => FONT_WEIGHTS_LABELS[value]}
          />
        }
        rightColumn={
          <Input
            ref={inputRef}
            type="number"
            value={localFontSize}
            onBlur={onBlurEnterFontSize}
            onFocus={onShowFakeSelection}
            onChange={onChangeFontSize}
            onKeyPress={withEnterPress(onBlurEnterFontSize)}
            placeholder="20"
          />
        }
      />
    </>
  );
};

export default FontStyles;
