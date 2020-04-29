import Markdown from 'markdown-to-jsx';
import React from 'react';

import { styled } from '@/hocs';

import { Bubble, Message } from '../components';
import { MessageProps } from '../components/Message';

const DebugMessage = styled(Message)`
  ${Bubble} {
    background: #eef4f6;
  }
`;

type DebugProps = Omit<MessageProps, 'iconProps'> & {
  message: string;
};

const Debug: React.FC<DebugProps> = ({ message, ...props }) => (
  <DebugMessage iconProps={{ icon: 'variable', color: '#6b95e9' }} {...props}>
    <Markdown>{message}</Markdown>
  </DebugMessage>
);

export default Debug;
