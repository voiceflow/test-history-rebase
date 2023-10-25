import * as Platform from '@voiceflow/platform-config';
import { Intent } from '@voiceflow/sdk-logux-designer';
import { SectionV2, Text } from '@voiceflow/ui';
import React from 'react';

interface CommandSectionItemProps {
  onClick: () => void;
  intent: Platform.Base.Models.Intent.Model | Intent | null;
  onRemove: () => void;
}

const CommandSectionItem: React.FC<CommandSectionItemProps> = ({ intent, onClick, onRemove }) => {
  return (
    <SectionV2.ListItem icon="intentSmall" actionCentred onClick={onClick} action={<SectionV2.RemoveButton onClick={onRemove} />}>
      <Text color={!intent?.name ? '#8da2b5' : 'inherit'}>{intent?.name || 'Select trigger intent'}</Text>
    </SectionV2.ListItem>
  );
};

export default CommandSectionItem;
