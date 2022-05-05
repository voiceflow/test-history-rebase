import { Box, Input } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';

interface NameSectionProps {
  name: string;
  setName: (name: string) => void;
  saveName?: () => void;
  autofocus?: boolean;
}

const NameSection: React.FC<NameSectionProps> = ({ name, setName, autofocus, saveName }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (autofocus) {
      inputRef.current?.focus();
    }
  });
  return (
    <Section backgroundColor="#fdfdfd" header="Name" variant={SectionVariant.QUATERNARY} customHeaderStyling={{ paddingTop: '20px' }}>
      <Box paddingBottom={24}>
        <Input ref={inputRef} placeholder="Enter intent name" value={name} onChangeText={setName} onBlur={() => saveName?.()} />
      </Box>
    </Section>
  );
};

export default NameSection;
