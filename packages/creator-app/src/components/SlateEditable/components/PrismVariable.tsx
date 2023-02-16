import React from 'react';
import { RenderLeafProps } from 'slate-react';

import Text from './Text';
import VariablesPopper from './VariablesPopper';

const STYLE: React.CSSProperties = { fontWeight: 600 };

const PrismVariable: React.FC<RenderLeafProps> = (props) => {
  const [textNode, setTextNode] = React.useState<HTMLSpanElement | null>(null);

  return (
    <>
      <Text
        ref={setTextNode}
        {...props}
        leaf={{ ...props.leaf, text: props.leaf.text.endsWith('}') ? `${props.leaf.text}-${props.leaf.text}` : props.leaf.text }}
        styleOverrides={STYLE}
      />

      {textNode && <VariablesPopper leaf={props.leaf} textNode={textNode} />}
    </>
  );
};

export default PrismVariable;
