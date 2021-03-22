import React from 'react';

import { preventDefault } from '@/utils/dom';

import { BlockProperty, TextAlign } from '../constants';
import MarkupSlateEditor, { MarkupEditor } from '../MarkupSlateEditor';
import IconButton from './IconButton';

type TextAlignsProps = {
  editor: MarkupEditor;
};

const TextAligns: React.FC<TextAlignsProps> = ({ editor }) => (
  <>
    <IconButton
      icon="textAlignLeft"
      active={
        MarkupSlateEditor.isBlockPropertyActive(editor, BlockProperty.TEXT_ALIGN, undefined) ||
        MarkupSlateEditor.isBlockPropertyActive(editor, BlockProperty.TEXT_ALIGN, TextAlign.LEFT)
      }
      onMouseDown={preventDefault(() => MarkupSlateEditor.setBlockProperty(editor, BlockProperty.TEXT_ALIGN, TextAlign.LEFT))}
    />
    <IconButton
      icon="textAlignCenter"
      active={MarkupSlateEditor.isBlockPropertyActive(editor, BlockProperty.TEXT_ALIGN, TextAlign.CENTER)}
      onMouseDown={preventDefault(() => MarkupSlateEditor.setBlockProperty(editor, BlockProperty.TEXT_ALIGN, TextAlign.CENTER))}
    />
    <IconButton
      icon="textAlignRight"
      active={MarkupSlateEditor.isBlockPropertyActive(editor, BlockProperty.TEXT_ALIGN, TextAlign.RIGHT)}
      onMouseDown={preventDefault(() => MarkupSlateEditor.setBlockProperty(editor, BlockProperty.TEXT_ALIGN, TextAlign.RIGHT))}
    />
  </>
);

export default TextAligns;
