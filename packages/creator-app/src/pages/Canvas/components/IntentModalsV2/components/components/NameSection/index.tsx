import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Input } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import * as Intent from '@/ducks/intent';
import { useDispatch } from '@/hooks';

interface NameSectionProps {
  intent: Realtime.Intent;
}

const NameSection: React.FC<NameSectionProps> = ({ intent }) => {
  const patchIntent = useDispatch(Intent.patchIntent);

  const handleNameChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    patchIntent(intent.id, { name: target.value });
  };

  return (
    <Section backgroundColor="#fdfdfd" header="Name" variant={SectionVariant.QUATERNARY}>
      <Box paddingBottom={24}>
        <Input placeholder="Enter intent name" value={intent?.name} onChange={handleNameChange} />
      </Box>
    </Section>
  );
};

export default NameSection;
