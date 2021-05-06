import cn from 'classnames';
import React from 'react';

import { SSML_TAG_REGEX } from '@/constants';
import { ClassName } from '@/styles/constants';

import { Message } from '../components';
import { MessageProps } from '../components/Message';

type SpeakProps = Omit<MessageProps, 'iconProps'> & {
  voice?: string;
  message: string;
};

const Speak: React.FC<SpeakProps> = ({ voice, message, className, ...props }) => {
  const noSSMLMessage = message.replace(SSML_TAG_REGEX, '');
  return noSSMLMessage ? (
    <Message className={cn(ClassName.CHAT_DIALOG_SPEAK_MESSAGE, className)} {...props}>
      {noSSMLMessage}
    </Message>
  ) : null;
};

export default Speak;
