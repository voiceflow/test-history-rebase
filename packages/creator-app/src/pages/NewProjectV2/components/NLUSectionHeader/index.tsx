import { Box, Flex } from '@voiceflow/ui';
import React from 'react';

import InfoIcon from '@/components/InfoIcon';

import { InfoIconContainer, NLUTooltip } from './components';

interface NLUSectionHeaderProps {
  showInfoIcon: boolean;
}

const NLUSectionHeader: React.FC<NLUSectionHeaderProps> = ({ showInfoIcon }) => {
  return (
    <Flex>
      <Box pr={12}>NLU</Box>{' '}
      <InfoIconContainer show={showInfoIcon}>
        <InfoIcon>
          <NLUTooltip />
        </InfoIcon>
      </InfoIconContainer>
    </Flex>
  );
};

export default NLUSectionHeader;
