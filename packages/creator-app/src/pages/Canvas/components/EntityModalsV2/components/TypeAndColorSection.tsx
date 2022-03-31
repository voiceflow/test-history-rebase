import { Box, ColorPicker, FlexApart } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import SlotSelect from '@/components/SlotSelect';

interface TypeAndColorSectionProps {
  type: string | null;
  onChangeType: (type: string) => void;
  name: string;
  color: string;
  saveColor: (color: string) => void;
}

const TypeAndColorSection: React.FC<TypeAndColorSectionProps> = ({ color, saveColor, name, type, onChangeType }) => {
  return (
    <Section
      dividers={false}
      backgroundColor="#fdfdfd"
      header="Type"
      variant={SectionVariant.QUATERNARY}
      customHeaderStyling={{ paddingTop: '16px' }}
      customContentStyling={{ paddingBottom: '24px' }}
    >
      <FlexApart>
        <Box flex={2} mr={24}>
          <SlotSelect value={type} onChange={onChangeType} />
        </Box>
        <ColorPicker tagName={name} selectedColor={color} onChange={saveColor} />
      </FlexApart>
    </Section>
  );
};

export default TypeAndColorSection;
