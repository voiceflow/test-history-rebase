import { TextData } from '@voiceflow/general-types/build/nodes/text';
import React from 'react';

import { serializeSlateToJSX } from '@/utils/slate';

import { Message } from '../components';
import { MessageProps } from '../components/Message';

type TextProps = Omit<MessageProps, 'iconProps'> & {
  slate: TextData;
};

const Text: React.FC<TextProps> = ({ slate, ...props }) => {
  const content = React.useMemo(() => serializeSlateToJSX(slate.content), []);

  return <Message {...props}>{content}</Message>;
};

export default Text;
