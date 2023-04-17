import React from 'react';

import BaseMessage, { BaseMessageProps } from '../../Base';

interface StreamProps extends Omit<BaseMessageProps, 'iconProps'> {
  audio: string;
  duration?: number;
}

const Stream: React.FC<StreamProps> = ({ audio, duration, ...props }) => <BaseMessage {...props}>{audio}</BaseMessage>;

export default Stream;
