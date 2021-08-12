import React from 'react';

import { Message } from '../components';
import { MessageProps } from '../components/Message';

type UserProps = Omit<MessageProps, 'iconProps'> & {
  input: string;
  focusedTurnID: string | null;
  turnID?: string;
};

const User: React.FC<UserProps> = ({ input, focusedTurnID, turnID, ...props }) => {
  return (
    <Message focused={focusedTurnID === turnID} withLogo={false} rightAlign {...props}>
      {input}
    </Message>
  );
};

export default User;
