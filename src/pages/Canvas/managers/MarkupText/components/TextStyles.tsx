import React from 'react';

import { preventDefault } from '@/utils/dom';

import { LeafProperty } from '../constants';
import MarkupSlateEditor, { MarkupEditor } from '../MarkupSlateEditor';
import IconButton from './IconButton';

type TextStylesProps = {
  editor: MarkupEditor;
};

const TextStyles: React.FC<TextStylesProps> = ({ editor }) => {
  const isItalicActive = MarkupSlateEditor.isLeafPropertyActive(editor, LeafProperty.ITALIC, true);
  const isUnderlineActive = MarkupSlateEditor.isLeafPropertyActive(editor, LeafProperty.UNDERLINE, true);

  return (
    <>
      <IconButton
        icon="italic"
        active={isItalicActive}
        onMouseDown={preventDefault(() => MarkupSlateEditor.setLeafProperty(editor, LeafProperty.ITALIC, !isItalicActive))}
      />

      <IconButton
        icon="underline"
        active={isUnderlineActive}
        onMouseDown={preventDefault(() => MarkupSlateEditor.setLeafProperty(editor, LeafProperty.UNDERLINE, !isUnderlineActive))}
      />
    </>
  );
};

export default TextStyles;
