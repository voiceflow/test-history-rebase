import React from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { Editor } from 'slate';

import Select from '@/components/Select';
import { preventDefault } from '@/utils/dom';

import { Font, FONT_WEIGHTS_LABELS, FONT_WEIGHTS_PER_FONT_FAMILY, FONTS_LABELS, FontWeight, TextProperty } from '../../constants';
import MarkupSlateEditor from '../../MarkupSlateEditor';
import { FormGroup } from './components';

interface FontStylesProps {
  editor: Editor;
}

const FontStyles: React.FC<FontStylesProps> = ({ editor }) => {
  const fontFamily = MarkupSlateEditor.textProperty(editor, TextProperty.FONT_FAMILY) || Font.OPEN_SANS;
  const fontWeight = MarkupSlateEditor.textProperty(editor, TextProperty.FONT_WEIGHT) || FontWeight.REGULAR;

  const onChangeFontWeight = (value: FontWeight) => {
    MarkupSlateEditor.setTextProperty(editor, TextProperty.FONT_WEIGHT, value);
  };

  const onChangeFontFamily = (value: Font) => {
    unstable_batchedUpdates(() => {
      MarkupSlateEditor.setTextProperty(editor, TextProperty.FONT_FAMILY, value);

      if (!FONT_WEIGHTS_PER_FONT_FAMILY[value].includes(fontWeight)) {
        MarkupSlateEditor.setTextProperty(editor, TextProperty.FONT_WEIGHT, FONT_WEIGHTS_PER_FONT_FAMILY[value][0]);
      }
    });
  };

  return (
    <FormGroup
      leftColumn={
        <Select
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
