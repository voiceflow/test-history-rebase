import { Box, BoxFlex } from '@voiceflow/ui';
import React from 'react';

import { useTheme } from '@/hooks';

interface LayoutItemProps {
  src?: string;
  title?: string;
  description?: string;
}

const LayoutItem: React.FC<LayoutItemProps> = ({ src, title, description }) => {
  const theme = useTheme();

  return (
    <BoxFlex>
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
    </BoxFlex>
  );
};

export default LayoutItem;
