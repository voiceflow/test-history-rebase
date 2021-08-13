import { slate } from '@voiceflow/internal';
import React from 'react';
import { RenderLeafProps } from 'slate-react';

import { useSlateEditor } from '../contexts';

interface TextProps extends RenderLeafProps {
  styleOverrides?: React.CSSProperties;
}

const Text: React.ForwardRefRenderFunction<HTMLSpanElement, TextProps> = ({ leaf, children, attributes, styleOverrides }, ref) => {
  const editor = useSlateEditor();

  return (
    <span ref={ref} {...attributes} style={{ ...slate.getTextCSSProperties(leaf), ...editor.getFakeSelectionTextStyles(leaf), ...styleOverrides }}>
      {children}
    </span>
  );
};

export default React.forwardRef<HTMLSpanElement, TextProps>(Text);
