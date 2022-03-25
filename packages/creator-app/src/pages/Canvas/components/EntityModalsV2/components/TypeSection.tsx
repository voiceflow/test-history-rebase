import { Box, Flex } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import SlotSelect from '@/components/SlotSelect';

interface TypeSectionProps {
  type: string | null;
  onChangeType: (type: string) => void;
}

const TypeSection: React.FC<TypeSectionProps> = ({ type, onChangeType }) => {
  return (
    <Section
      dividers={false}
      backgroundColor="#fdfdfd"
      header="Type"
      variant={SectionVariant.QUATERNARY}
      customHeaderStyling={{ paddingTop: '16px' }}
      customContentStyling={{ paddingBottom: '24px' }}
    >
      <Flex>
        <SlotSelect value={type} onChange={onChangeType} />
        <Box ml={16}>Color Section Area</Box>
      </Flex>
    </Section>
  );
};

export default TypeSection;
