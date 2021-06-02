import React from 'react';

import { Text } from '@/components/Text';

type StageHeaderProps = {
  color?: string;
};

const StageHeader: React.FC<StageHeaderProps> = ({ color = '#279745', children }) => (
  <Text mb={11} fontWeight={600} fontSize={15} color={color}>
    {children}
  </Text>
);

export default StageHeader;
