import { BaseNode } from '@voiceflow/base-types';
import { serializeToMarkdown } from '@voiceflow/slate-serializer/markdown';
import React from 'react';

import { Markdown } from '@/components/Markdown/Markdown.component';

import BaseMessage, { BaseMessageProps } from '../../Base';

interface TextProps extends Omit<BaseMessageProps, 'iconProps'> {
  slate: BaseNode.Text.TextData;
  ai?: boolean;
}

export const MarkdownText: React.FC<TextProps> = ({ slate, ai, ...props }) => {
  const content = React.useMemo(() => serializeToMarkdown(slate.content) || '', [slate.content]);

  return (
    <BaseMessage {...props} isAiMessage={ai}>
      <Markdown>{content}</Markdown>
    </BaseMessage>
  );
};

export default MarkdownText;
