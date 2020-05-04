import React from 'react';

import { styled } from '@/hocs';

import { Message } from '../components';
import { MessageProps } from '../components/Message';

const Voice = styled.div`
  width: 100%;
  color: #62778c;
`;

type SpeakProps = Omit<MessageProps, 'iconProps'> & {
  voice?: string;
  message: string;
};

const Speak: React.FC<SpeakProps> = ({ voice, message, ...props }) => (
  <Message iconProps={{ icon: 'alexa' }} {...props}>
    {voice && <Voice>{voice}</Voice>}
    {message}
  </Message>
);

export default Speak;
