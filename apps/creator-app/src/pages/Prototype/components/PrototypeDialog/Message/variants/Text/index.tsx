import { BaseNode } from '@voiceflow/base-types';
import { serializeToMarkdown } from '@voiceflow/slate-serializer/markdown';
import Markdown from 'markdown-to-jsx';
import React from 'react';

import { styled } from '@/hocs/styled';

import BaseMessage, { BaseMessageProps } from '../../Base';

interface TextProps extends Omit<BaseMessageProps, 'iconProps'> {
  slate: BaseNode.Text.TextData;
  ai?: boolean;
}

const MarkdownWrapper = styled(Markdown)`
  p: {
    margin-bottom: 0;
  }
`;

export const MarkdownText: React.FC<TextProps> = ({ slate, ai, ...props }) => {
  const content = React.useMemo(() => serializeToMarkdown(slate.content) || '', [slate.content]);

  return (
    <BaseMessage {...props} isAiMessage={ai}>
      <MarkdownWrapper>{content}</MarkdownWrapper>
    </BaseMessage>
  );
};

export default MarkdownText;
