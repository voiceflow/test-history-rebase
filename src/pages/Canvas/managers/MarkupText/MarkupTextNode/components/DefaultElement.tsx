import React from 'react';
import { RenderElementProps, useSlate } from 'slate-react';

import { BlockProperty, TextAlign } from '../../constants';

const DefaultElement: React.FC<RenderElementProps> = ({ attributes, children, element }) => {
  const editor = useSlate();
  const Tag = editor.isInline(element) ? 'span' : 'div';

  return (
    <Tag {...attributes} style={{ position: 'relative', textAlign: element[BlockProperty.TEXT_ALIGN] as TextAlign }}>
      {children}
    </Tag>
  );
};

export default DefaultElement;
