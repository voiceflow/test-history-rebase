import { BaseNode } from '@voiceflow/base-types';
import React from 'react';

import { serializeSlateToJSX } from '@/utils/slate';

import BaseMessage, { BaseMessageProps } from '../../Base';

interface TextProps extends Omit<BaseMessageProps, 'iconProps'> {
  slate: BaseNode.Text.TextData;
}

const Text: React.FC<TextProps> = ({ slate, ...props }) => {
  const content = React.useMemo(() => serializeSlateToJSX(slate.content), []);

  return <BaseMessage {...props}>{content}</BaseMessage>;
};

export default Text;
