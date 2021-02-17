import React from 'react';

import Box, { Flex } from '@/components/Box';
import { useTheme } from '@/hooks';

export type PrototypeLayoutItemProps = {
  src?: string;
  title?: string;
  description?: string;
};

const PrototypeLayoutItem: React.FC<PrototypeLayoutItemProps> = ({ src, title, description }) => {
  const theme = useTheme();

  return (
    <Flex>
      <Box mr={16} height={42}>
        <img src={src} height="100%" alt={title} />
      </Box>
      <Box>
        <Box mb={4} fontSize={15} color={theme.colors.primary}>
          {title}
        </Box>
        <Box fontSize={13} color={theme.colors.secondary}>
          {description}
        </Box>
      </Box>
    </Flex>
  );
};

export default PrototypeLayoutItem;
