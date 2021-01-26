import React from 'react';

import { prettifyVoice } from '@/components/SSML/utils';
import { SSML_TAG_REGEX } from '@/constants';
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

const Speak: React.FC<SpeakProps> = ({ voice, message, ...props }) => {
  const noSSMLMessage = message.replace(SSML_TAG_REGEX, '');
  return noSSMLMessage ? (
    <Message {...props}>
      {voice && <Voice>{prettifyVoice(voice)}</Voice>}
      {noSSMLMessage}
    </Message>
  ) : null;
};

export default Speak;
