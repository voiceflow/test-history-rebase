import React from 'react';

import type { BaseMessageProps } from '../../Base';
import BaseMessage from '../../Base';

interface StreamProps extends Omit<BaseMessageProps, 'iconProps'> {
  audio: string;
  duration?: number;
}

const Stream: React.FC<StreamProps> = ({ audio, duration, ...props }) => <BaseMessage {...props}>{audio}</BaseMessage>;

export default Stream;
