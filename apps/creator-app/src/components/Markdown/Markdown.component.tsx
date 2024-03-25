import { Markdown as ChatMarkdown } from '@voiceflow/react-chat';
import { clsx } from '@voiceflow/style';
import React from 'react';
import rehypeRaw from 'rehype-raw';

import { markdownStyle } from './Markdown.css';

export const Markdown: React.FC<React.ComponentProps<typeof ChatMarkdown>> = ({ className, ...props }) => (
  <ChatMarkdown rehypePlugins={[rehypeRaw]} className={clsx(markdownStyle, className)} {...props} />
);
