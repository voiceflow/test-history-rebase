import React from 'react';
import { RenderLeafProps } from 'slate-react';

import { TextProperty } from '../../constants';
import { fakeSelectionLeafStyles } from '../../MarkupSlateEditor';

const Leaf: React.FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
  const color = leaf[TextProperty.COLOR];
  const isItalic = leaf[TextProperty.ITALIC];
  const fontWeight = leaf[TextProperty.FONT_WEIGHT];
  const fontFamily = leaf[TextProperty.FONT_FAMILY];
  const isUnderline = leaf[TextProperty.UNDERLINE];

  return (
    <span
      {...attributes}
      style={{
        color: color && `rgba(${color.r},${color.g},${color.b},${color.a})`,
        fontStyle: isItalic ? 'italic' : '',
        fontWeight: fontWeight ? Number(fontWeight) : undefined,
        fontFamily: fontFamily ? `"${fontFamily}"` : undefined,
        textDecoration: isUnderline ? 'underline' : undefined,
        ...fakeSelectionLeafStyles(leaf),
      }}
    >
      {children}
    </span>
  );
};

export default Leaf;
