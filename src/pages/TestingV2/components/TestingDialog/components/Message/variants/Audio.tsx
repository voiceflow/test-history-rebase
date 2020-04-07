import React from 'react';

import { Message } from '../components';
import { MessageProps } from '../components/Message';

type AudioProps = Omit<MessageProps, 'iconProps'> & {
  name: string;
};

const Audio: React.FC<AudioProps> = ({ name, ...props }) => (
  <Message iconProps={{ icon: 'volume', color: '#f65b6d' }} {...props}>
    {name}
  </Message>
);

export default Audio;
