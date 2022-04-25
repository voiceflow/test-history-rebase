import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';

import { CodeColorStyle } from '../constants';
import { getJSCodeStyle } from '../utils';

export interface PreviewCodeProps {
  code: string;
}

const previwCodeStyle = getJSCodeStyle({ colors: CodeColorStyle });

const PreviewCode: React.FC<PreviewCodeProps> = ({ code }) => {
  return (
    <SyntaxHighlighter
      language="javascript"
      style={previwCodeStyle}
      customStyle={{ fontFamily: 'Fira Code', fontSize: '13px', padding: 0 }}
      wrapLongLines
    >
      {code}
    </SyntaxHighlighter>
  );
};

export default PreviewCode;
