import React from 'react';

import BaseMessage, { BaseMessageProps } from '../../Base';

interface UserProps extends Omit<BaseMessageProps, 'iconProps'> {
  input: string;
  focusedTurnID: string | null;
  turnID?: string;
}

const User: React.FC<UserProps> = ({ input, focusedTurnID, turnID, ...props }) => {
  return (
    <BaseMessage focused={focusedTurnID === turnID} withLogo={false} rightAlign {...props}>
      {input}
    </BaseMessage>
  );
};

export default User;
