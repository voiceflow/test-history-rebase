import { BaseNode } from '@voiceflow/base-types';
import { serializeToJSX } from '@voiceflow/slate-serializer/jsx';
import React from 'react';

import { getValidHref } from '@/utils/string';

import BaseMessage, { BaseMessageProps } from '../../Base';

interface TextProps extends Omit<BaseMessageProps, 'iconProps'> {
  slate: BaseNode.Text.TextData;
  ai?: boolean;
}

const Text: React.FC<TextProps> = ({ slate, ai, ...props }) => {
  const content = React.useMemo(() => serializeToJSX(slate.content, { transformHref: getValidHref }), [slate.content]);

  return (
    <BaseMessage {...props} isAiMessage={ai}>
      {content}
    </BaseMessage>
  );
};

export default Text;
