import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';

import { CodeColorStyle } from '../constants';
import { getJSCodeStyle } from '../utils';

export interface PreviewCodeProps {
  code: string;
}

const previewCodeStyle = getJSCodeStyle({ colors: CodeColorStyle });

const PreviewCode: React.FC<PreviewCodeProps> = ({ code }) => (
  <SyntaxHighlighter
    style={previewCodeStyle}
    language="javascript"
    customStyle={{ fontFamily: 'Fira Code', fontSize: '13px', padding: 0, margin: 0 }}
    wrapLongLines
  >
    {code}
  </SyntaxHighlighter>
);

export default PreviewCode;
