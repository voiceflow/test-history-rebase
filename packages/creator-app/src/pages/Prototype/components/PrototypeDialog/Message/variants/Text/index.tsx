import { BaseNode } from '@voiceflow/base-types';
import { serializeToJSX } from '@voiceflow/slate-serializer/jsx';
import React from 'react';

import BaseMessage, { BaseMessageProps } from '../../Base';

interface TextProps extends Omit<BaseMessageProps, 'iconProps'> {
  slate: BaseNode.Text.TextData;
}

const Text: React.FC<TextProps> = ({ slate, ...props }) => {
  const content = React.useMemo(() => serializeToJSX(slate.content), []);

  return <BaseMessage {...props}>{content}</BaseMessage>;
};

export default Text;
