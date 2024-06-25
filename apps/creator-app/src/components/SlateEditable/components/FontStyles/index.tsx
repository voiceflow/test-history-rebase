import { preventDefault, Select } from '@voiceflow/ui';
import React from 'react';
import { unstable_batchedUpdates } from 'react-dom';

import { Hotkey, TextProperty } from '../../constants';
import { useSlateEditor } from '../../contexts';
import { EditorAPI } from '../../editor';
import { useEditorHotkey } from '../../hooks';
import { FormGroup } from './components';
import { Font, FONT_WEIGHTS_LABELS, FONT_WEIGHTS_PER_FONT_FAMILY, FONTS_LABELS, FontWeight } from './constants';

const FontStyles: React.FC = () => {
  const editor = useSlateEditor();

  const fontFamily = EditorAPI.textProperty(editor, TextProperty.FONT_FAMILY, Font.OPEN_SANS);
  const fontWeight = EditorAPI.textProperty(editor, TextProperty.FONT_WEIGHT, FontWeight.REGULAR);

  const onChangeFontWeight = (value: string) => {
    EditorAPI.setTextProperty(editor, TextProperty.FONT_WEIGHT, value);
  };

  const onChangeFontFamily = (value: string) => {
    unstable_batchedUpdates(() => {
      EditorAPI.setTextProperty(editor, TextProperty.FONT_FAMILY, value);

      if (!FONT_WEIGHTS_PER_FONT_FAMILY[value].includes(fontWeight)) {
        EditorAPI.setTextProperty(editor, TextProperty.FONT_WEIGHT, FONT_WEIGHTS_PER_FONT_FAMILY[value][0]);
      }
    });
  };

  useEditorHotkey(Hotkey.BOLD, () => {
    const nextFontWeight = fontWeight === FontWeight.REGULAR ? FontWeight.BOLD : FontWeight.REGULAR;

    if (
      (FONT_WEIGHTS_PER_FONT_FAMILY[fontFamily] || FONT_WEIGHTS_PER_FONT_FAMILY[Font.OPEN_SANS])?.includes(
        nextFontWeight
      )
    ) {
      EditorAPI.setTextProperty(editor, TextProperty.FONT_WEIGHT, nextFontWeight);
    }
  });

  return (
    <FormGroup
      leftColumn={
        <Select
          useLayers
          value={fontFamily}
          options={Object.values(Font)}
          onSelect={onChangeFontFamily}
          minWidth={false}
          onMouseDown={preventDefault()}
          getOptionLabel={(value) => FONTS_LABELS[value!]}
          optionsMaxSize={Object.values(Font).length}
        />
      }
      rightColumn={
        <Select
          useLayers
          value={fontWeight}
          options={FONT_WEIGHTS_PER_FONT_FAMILY[fontFamily]}
          onSelect={onChangeFontWeight}
          minWidth={false}
          onMouseDown={preventDefault()}
          getOptionLabel={(value) => FONT_WEIGHTS_LABELS[value!]}
          optionsMaxSize={FONT_WEIGHTS_PER_FONT_FAMILY[fontFamily].length}
        />
      }
    />
  );
};

export default FontStyles;
