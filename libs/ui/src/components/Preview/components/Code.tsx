import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';

import { CodeColorStyle } from '../constants';
import { getJSCodeStyle } from '../utils';

export interface PreviewCodeProps {
  code: string;
  padding?: number | string;
  language?: string;
  wrapLongLines?: boolean;
}

const previewCodeStyle = getJSCodeStyle({ colors: CodeColorStyle });

const PreviewCode: React.FC<PreviewCodeProps> = ({
  code,
  language = 'javascript',
  padding = 0,
  wrapLongLines = true,
}) => (
  <SyntaxHighlighter
    style={previewCodeStyle}
    language={language}
    customStyle={{ fontFamily: 'Fira Code', fontSize: '13px', padding, margin: 0 }}
    wrapLongLines={wrapLongLines}
  >
    {code}
  </SyntaxHighlighter>
);

export default PreviewCode;
