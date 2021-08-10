import { slate } from '@voiceflow/internal';
import React from 'react';
import { RenderLeafProps } from 'slate-react';

import { useSlateEditor } from '../contexts';

const Text: React.FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
  const editor = useSlateEditor();

  return (
    <span
      {...attributes}
      style={{
        ...slate.getTextCSSProperties(leaf),
        ...editor.getFakeSelectionTextStyles(leaf),
      }}
    >
      {children}
    </span>
  );
};

export default Text;
