import React from 'react';
import { RenderLeafProps } from 'slate-react';

import { Markup } from '@/models';

import { LeafProperty } from '../../constants';
import { fakeSelectionLeafStyles } from '../../MarkupSlateEditor';

const Leaf: React.FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
  const color = leaf[LeafProperty.COLOR] as Markup.Color | undefined;
  const fontWeight = leaf[LeafProperty.FONT_WEIGHT] as string | undefined;
  const fontFamily = leaf[LeafProperty.FONT_FAMILY] as string | undefined;
  const isItalic = leaf[LeafProperty.ITALIC] as boolean | undefined;
  const isUnderline = leaf[LeafProperty.UNDERLINE] as boolean | undefined;

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
