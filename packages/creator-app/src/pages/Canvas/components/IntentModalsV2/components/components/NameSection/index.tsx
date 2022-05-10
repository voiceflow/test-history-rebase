import { Box, Input } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';

interface NameSectionProps {
  name: string;
  setName: (name: string) => void;
  saveName?: () => void;
  autofocus?: boolean;
  hasBottomPadding?: boolean;
  isBuiltIn?: boolean;
}

const NameSection: React.FC<NameSectionProps> = ({ isBuiltIn, name, hasBottomPadding, setName, autofocus, saveName }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (autofocus) {
      inputRef.current?.focus();
    }
  });

  return (
    <Section backgroundColor="#fdfdfd" header="Name" variant={SectionVariant.QUATERNARY} customHeaderStyling={{ paddingTop: '20px' }}>
      <Box paddingBottom={hasBottomPadding ? 24 : 0}>
        <Input
          disabled={!!isBuiltIn}
          ref={inputRef}
          placeholder="Enter intent name"
          value={name}
          onChangeText={setName}
          onBlur={() => saveName?.()}
        />
      </Box>
    </Section>
  );
};

export default NameSection;
