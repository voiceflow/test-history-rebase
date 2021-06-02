import React from 'react';
import { RenderElementProps, useSlate } from 'slate-react';

import { ElementProperty } from '../../constants';

const DefaultElement: React.FC<RenderElementProps> = ({ attributes, children, element }) => {
  const editor = useSlate();
  const Tag = editor.isInline(element) ? 'span' : 'div';

  return (
    <Tag {...attributes} style={{ position: 'relative', textAlign: element[ElementProperty.TEXT_ALIGN] }}>
      {children}
    </Tag>
  );
};

export default DefaultElement;
