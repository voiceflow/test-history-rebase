import { Box, SectionV2, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { WAITING_FOR_INTENT_PLACEHOLDER } from '@/pages/Canvas/constants';

const ListeningForIntentSection: React.FC = () => (
  <SectionV2.SimpleSection>
    <Box.Flex gap={12}>
      <SvgIcon icon="radar" variant={SvgIcon.Variant.STANDARD} />

      <SectionV2.Title>{WAITING_FOR_INTENT_PLACEHOLDER}</SectionV2.Title>
    </Box.Flex>
  </SectionV2.SimpleSection>
);

export default ListeningForIntentSection;
