import { Flex } from '@voiceflow/ui';
import React from 'react';

import { ClassName } from '@/styles/constants';

interface InputGroupProps {
  className?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ children, className }) => (
  <Flex fullWidth className={`${ClassName.INPUT_GROUP} ${className ?? ''}`}>
    {children}
  </Flex>
);

export default InputGroup;
