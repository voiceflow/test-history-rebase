import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2, Text } from '@voiceflow/ui';
import React from 'react';

import { prettifyIntentName } from '@/utils/intent';

interface CommandSectionItemProps {
  onClick: () => void;
  intent: Realtime.Intent | null;
  onRemove: () => void;
}

const CommandSectionItem: React.FC<CommandSectionItemProps> = ({ intent, onClick, onRemove }) => {
  const intentName = intent ? prettifyIntentName(intent.name) : null;

  return (
    <SectionV2.ListItem icon="intentSmall" actionCentred onClick={onClick} action={<SectionV2.RemoveButton onClick={onRemove} />}>
      <Text color={!intent?.name ? '#8da2b5' : 'inherit'}>{intentName || 'Select trigger intent'}</Text>
    </SectionV2.ListItem>
  );
};

export default CommandSectionItem;
