import { Divider, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import type { BaseMessageProps } from '../Base';

interface SessionProps extends Omit<BaseMessageProps, 'iconProps' | 'pmStatus'> {
  message: string;
}

const Session: React.FC<SessionProps> = ({ message, startTime }) => {
  return (
    <TippyTooltip offset={[0, 8]} placement="top" content={startTime} disabled={!startTime}>
      <Divider>{message}</Divider>
    </TippyTooltip>
  );
};

export default Session;
