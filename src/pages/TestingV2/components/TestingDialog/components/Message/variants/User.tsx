import React from 'react';

import { Message } from '../components';
import { MessageProps } from '../components/Message';

type UserProps = Omit<MessageProps, 'iconProps'> & {
  input: string;
};

const User: React.FC<UserProps> = ({ input, ...props }) => (
  <Message rightAlign iconProps={{ icon: 'user', color: '#6b95e9' }} {...props}>
    {input}
  </Message>
);

export default User;
