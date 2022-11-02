import { Box, Flex, TutorialInfoIcon } from '@voiceflow/ui';
import React from 'react';

import { NLUTooltip } from './components';

interface NLUSectionHeaderProps {
  showInfoIcon: boolean;
}

const NLUSectionHeader: React.FC<NLUSectionHeaderProps> = ({ showInfoIcon }) => (
  <Flex>
    <Box pr={8}>NLU</Box>
    <TutorialInfoIcon visible={showInfoIcon}>
      <NLUTooltip />
    </TutorialInfoIcon>
  </Flex>
);

export default NLUSectionHeader;
