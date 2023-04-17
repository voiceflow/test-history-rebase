import { Text } from '@voiceflow/ui';
import React from 'react';

interface StageHeaderProps extends React.PropsWithChildren {
  color?: string;
}

const StageHeader: React.FC<StageHeaderProps> = ({ color = '#279745', children }) => (
  <Text mb={11} fontWeight={600} fontSize={15} color={color}>
    {children}
  </Text>
);

export default StageHeader;
