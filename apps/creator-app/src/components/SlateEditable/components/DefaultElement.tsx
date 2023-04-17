import React from 'react';
import { RenderElementProps } from 'slate-react';

import { ElementProperty } from '../constants';
import { useSlateEditor } from '../contexts';

const DefaultElement: React.FC<RenderElementProps> = ({ attributes, children, element }) => {
  const editor = useSlateEditor();
  const Tag = editor.isInline(element) ? 'span' : 'div';

  return (
    <Tag {...attributes} style={{ position: 'relative', textAlign: element[ElementProperty.TEXT_ALIGN] as React.CSSProperties['textAlign'] }}>
      {children}
    </Tag>
  );
};

export default DefaultElement;
