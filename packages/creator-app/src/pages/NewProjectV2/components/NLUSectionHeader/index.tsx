import { Box, Flex, TutorialInfoIcon } from '@voiceflow/ui';
import React from 'react';

import { InfoIconContainer, NLUTooltip } from './components';

interface NLUSectionHeaderProps {
  showInfoIcon: boolean;
}

const NLUSectionHeader: React.FC<NLUSectionHeaderProps> = ({ showInfoIcon }) => (
  <Flex>
    <Box pr={12}>NLU</Box>{' '}
    <InfoIconContainer show={showInfoIcon}>
      <TutorialInfoIcon>
        <NLUTooltip />
      </TutorialInfoIcon>
    </InfoIconContainer>
  </Flex>
);

export default NLUSectionHeader;
