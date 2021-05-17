import React from 'react';
import { Editor } from 'slate';

import { preventDefault } from '@/utils/dom';

import { TextProperty } from '../constants';
import MarkupSlateEditor from '../MarkupSlateEditor';
import IconButton from './IconButton';

interface TextStylesProps {
  editor: Editor;
}

const TextStyles: React.FC<TextStylesProps> = ({ editor }) => {
  const isItalicActive = MarkupSlateEditor.isTextPropertyActive(editor, TextProperty.ITALIC, true);
  const isUnderlineActive = MarkupSlateEditor.isTextPropertyActive(editor, TextProperty.UNDERLINE, true);

  return (
    <>
      <IconButton
        icon="italic"
        active={isItalicActive}
        onMouseDown={preventDefault(() => MarkupSlateEditor.setTextProperty(editor, TextProperty.ITALIC, !isItalicActive))}
      />

      <IconButton
        icon="underline"
        active={isUnderlineActive}
        onMouseDown={preventDefault(() => MarkupSlateEditor.setTextProperty(editor, TextProperty.UNDERLINE, !isUnderlineActive))}
      />
    </>
  );
};

export default TextStyles;
