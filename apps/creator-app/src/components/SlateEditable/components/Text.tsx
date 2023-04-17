import { getTextCSSProperties } from '@voiceflow/slate-serializer';
import React from 'react';
import { RenderLeafProps } from 'slate-react';

import { useSlateEditor } from '../contexts';

interface TextProps extends RenderLeafProps {
  styleOverrides?: React.CSSProperties;
}

const Text: React.ForwardRefRenderFunction<HTMLSpanElement, TextProps> = ({ leaf, children, attributes, styleOverrides }, ref) => {
  const editor = useSlateEditor();

  return (
    <span
      ref={ref}
      {...attributes}
      style={{ ...(getTextCSSProperties(leaf) as React.CSSProperties), ...editor.getFakeSelectionTextStyles(leaf), ...styleOverrides }}
    >
      {children}
    </span>
  );
};

export default React.forwardRef<HTMLSpanElement, TextProps>(Text);
