import { Box, Flex } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import SlotSelect from '@/components/SlotSelect';

interface TypeSectionProps {
  type: string;
  onChangeType: (type: string) => void;
}

const TypeSection: React.FC<TypeSectionProps> = ({ type, onChangeType }) => {
  return (
    <Section dividers={false} backgroundColor="#fdfdfd" header="Type" variant={SectionVariant.SUBSECTION}>
      <Flex>
        <SlotSelect value={type} onChange={onChangeType} />
        <Box ml={16}>Color Section Area</Box>
      </Flex>
    </Section>
  );
};

export default TypeSection;
