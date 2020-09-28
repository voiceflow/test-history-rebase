import type { DraftJsBlockStyleButtonProps } from '@voiceflow/draft-js-buttons';
import { EditorState } from 'draft-js';
import _last from 'lodash/last';
import React from 'react';

import Select from '@/components/Select';

import { FONTS_LABELS, FONT_WEIGHTS_LABELS, FONT_WEIGHTS_PER_FONT_FAMILY, Font, FontWeight, InlineStylePrefix } from '../../constants';
import { getInlineStylePrefixAndValue, getSelectionPrefixedInlineStyle, togglePrefixedInlineStyle } from '../../utils';
import { FormGroup } from './components';

type FontStylesProps = Omit<DraftJsBlockStyleButtonProps, 'children'> & {
  saveEditorState: (state: EditorState) => void;
  applyFakeSelection: (state: EditorState) => EditorState;
  removeFakeSelection: (state: EditorState) => EditorState;
};

const FontStyles: React.FC<FontStylesProps> = ({ getEditorState, setEditorState, saveEditorState, applyFakeSelection, removeFakeSelection }) => {
  const { fontWeight, fontFamily } = React.useMemo(() => {
    const editorState = getEditorState?.();

    const fontWeightValue = FontWeight.REGULAR;
    const fontFamilyValue = Font.OPEN_SANS;

    if (!editorState) {
      return {
        fontWeight: fontWeightValue,
        fontFamily: fontFamilyValue,
      };
    }

    const fontFamilyStyle = _last(getSelectionPrefixedInlineStyle(editorState, InlineStylePrefix.FONT_FAMILY));
    const fontWeightStyle = _last(getSelectionPrefixedInlineStyle(editorState, InlineStylePrefix.FONT_WEIGHT));

    return {
      fontFamily: (getInlineStylePrefixAndValue(fontFamilyStyle)[1] as Font) || Font.OPEN_SANS,
      fontWeight: (getInlineStylePrefixAndValue(fontWeightStyle)[1] as FontWeight) || FontWeight.REGULAR,
    };
  }, [getEditorState?.()]);

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

  return (
    <FormGroup
      leftColumn={
        <Select
          value={fontFamily}
          onOpen={onShowFakeSelection}
          onClose={onHideFakeSelection}
          options={Object.values(Font)}
          onSelect={onChangeFontFamily}
          minWidth={false}
          getOptionLabel={(value) => FONTS_LABELS[value!]}
          optionsMaxSize={Object.values(Font).length}
        />
      }
      rightColumn={
        <Select
          value={fontWeight}
          onOpen={onShowFakeSelection}
          onClose={onHideFakeSelection}
          options={FONT_WEIGHTS_PER_FONT_FAMILY[fontFamily]}
          onSelect={onChangeFontWeight}
          minWidth={false}
          getOptionLabel={(value) => FONT_WEIGHTS_LABELS[value!]}
          optionsMaxSize={FONT_WEIGHTS_PER_FONT_FAMILY[fontFamily].length}
        />
      }
    />
  );
};

export default FontStyles;
