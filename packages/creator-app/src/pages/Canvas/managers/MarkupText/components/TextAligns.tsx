import { preventDefault } from '@voiceflow/ui';
import React from 'react';
import { Editor } from 'slate';

import { ElementProperty, TextAlign } from '../constants';
import MarkupSlateEditor from '../MarkupSlateEditor';
import IconButton from './IconButton';

interface TextAlignsProps {
  editor: Editor;
}

const TextAligns: React.FC<TextAlignsProps> = ({ editor }) => (
  <>
    <IconButton
      icon="textAlignLeft"
      active={
        MarkupSlateEditor.isElementPropertyActive(editor, ElementProperty.TEXT_ALIGN, undefined) ||
        MarkupSlateEditor.isElementPropertyActive(editor, ElementProperty.TEXT_ALIGN, TextAlign.LEFT)
      }
      onMouseDown={preventDefault(() => MarkupSlateEditor.setElementProperty(editor, ElementProperty.TEXT_ALIGN, TextAlign.LEFT))}
    />

    <IconButton
      icon="textAlignCenter"
      active={MarkupSlateEditor.isElementPropertyActive(editor, ElementProperty.TEXT_ALIGN, TextAlign.CENTER)}
      onMouseDown={preventDefault(() => MarkupSlateEditor.setElementProperty(editor, ElementProperty.TEXT_ALIGN, TextAlign.CENTER))}
    />

    <IconButton
      icon="textAlignRight"
      active={MarkupSlateEditor.isElementPropertyActive(editor, ElementProperty.TEXT_ALIGN, TextAlign.RIGHT)}
      onMouseDown={preventDefault(() => MarkupSlateEditor.setElementProperty(editor, ElementProperty.TEXT_ALIGN, TextAlign.RIGHT))}
    />
  </>
);

export default TextAligns;
