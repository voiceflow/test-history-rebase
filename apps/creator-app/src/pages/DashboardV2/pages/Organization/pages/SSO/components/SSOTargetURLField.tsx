import { Box, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import TextArea from '@/components/TextArea';

import { INPUT_WIDTH } from '../constants';

interface SSOTargetURLFieldProps {
  entryPoint: string;
  onChangeText: (text: string) => void;
}

const SSOTargetURLField: React.FC<SSOTargetURLFieldProps> = ({ entryPoint, onChangeText }) => {
  return (
    <SectionV2.SimpleSection>
      <Box.FlexAlignStart fullWidth>
        <Box.FlexAlignStart width={INPUT_WIDTH} flexDirection="column">
          <Box mb={10}>
            <SectionV2.Title bold secondary>
              IdP SSO Target URL
            </SectionV2.Title>
          </Box>

          <TextArea value={entryPoint} onChangeText={onChangeText} placeholder="Enter SSO target URL" />
        </Box.FlexAlignStart>
        <Box flex={1} ml={24} mt={25}>
          <SectionV2.Description secondary>The URL users of your organization will be directed to on log in.</SectionV2.Description>
        </Box>
      </Box.FlexAlignStart>
    </SectionV2.SimpleSection>
  );
};

export default SSOTargetURLField;
