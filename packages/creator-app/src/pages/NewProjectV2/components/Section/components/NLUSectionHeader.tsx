import { Box, Flex } from '@voiceflow/ui';
import React from 'react';

import InfoIcon from '@/components/InfoIcon';

import NLUTooltip from './NLUTooltip';

const NLUSectionHeader: React.FC = () => {
  return (
    <Flex>
      <Box pr={12}>NLU</Box>{' '}
      <InfoIcon>
        <NLUTooltip />
      </InfoIcon>
    </Flex>
  );
};

export default NLUSectionHeader;
