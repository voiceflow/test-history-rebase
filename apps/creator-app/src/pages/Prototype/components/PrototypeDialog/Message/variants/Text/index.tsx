import { BaseNode } from '@voiceflow/base-types';
import React from 'react';

import SlateEditable from '@/components/SlateEditable';

import BaseMessage, { BaseMessageProps } from '../../Base';

interface TextProps extends Omit<BaseMessageProps, 'iconProps'> {
  slate: BaseNode.Text.TextData;
  ai?: boolean;
}

const Text: React.FC<TextProps> = ({ slate, ai, ...props }) => {
  const content = React.useMemo(() => SlateEditable.serializeToJSX(slate.content), [slate.content]);

  return (
    <BaseMessage {...props} isAiMessage={ai}>
      {content}
    </BaseMessage>
  );
};

export default Text;
