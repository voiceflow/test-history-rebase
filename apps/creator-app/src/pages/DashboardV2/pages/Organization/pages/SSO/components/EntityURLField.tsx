import { Box, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import TextArea from '@/components/TextArea';

import { INPUT_WIDTH } from '../constants';

interface EntityURLFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const EntityURLField: React.FC<EntityURLFieldProps> = ({ value, onChange }) => (
  <SectionV2.SimpleSection>
    <Box.FlexAlignStart fullWidth>
      <Box.FlexAlignStart width={INPUT_WIDTH} flexDirection="column">
        <Box mb={10}>
          <SectionV2.Title bold secondary>
            Entity ID URL
          </SectionV2.Title>
        </Box>

        <TextArea value={value} placeholder="Enter entity ID URL" onChangeText={onChange} />
      </Box.FlexAlignStart>

      <Box flex={1} ml={24} mt={25}>
        <SectionV2.Description secondary>The IdP Entity ID for the identity provider your organization uses.</SectionV2.Description>
      </Box>
    </Box.FlexAlignStart>
  </SectionV2.SimpleSection>
);

export default EntityURLField;
