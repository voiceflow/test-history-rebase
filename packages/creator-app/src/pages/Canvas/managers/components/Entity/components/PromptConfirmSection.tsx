import { ChatModels } from '@voiceflow/chat-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2 } from '@voiceflow/ui';
import { VoiceModels } from '@voiceflow/voice-types';
import React from 'react';

import PromptForm from '@/components/PromptForm';
import { isEmptyPrompt } from '@/utils/prompt';

interface PromptConfirmSectionProps {
  title: string;
  onAdd: VoidFunction;
  prompt: ChatModels.Prompt[] | VoiceModels.IntentPrompt<string>[];
  onRemove: VoidFunction;
  onChange: (prompt: ChatModels.Prompt[] | VoiceModels.IntentPrompt<string>[]) => void;
  collapsed: boolean;
  placeholder: string;
  intentEntities: Realtime.Slot[];
}

const PromptConfirmSection: React.FC<PromptConfirmSectionProps> = ({
  title,
  onAdd,
  prompt,
  onChange,
  onRemove,
  collapsed,
  placeholder,
  intentEntities,
}) => (
  <SectionV2.ActionCollapseSection
    title={<SectionV2.Title bold={!collapsed}>{title}</SectionV2.Title>}
    action={collapsed ? <SectionV2.AddButton onClick={onAdd} /> : <SectionV2.RemoveButton onClick={onRemove} />}
    collapsed={collapsed}
  >
    <Box pt={4} pb={8}>
      <PromptForm slots={intentEntities} prompt={prompt} onChange={onChange} autofocus={isEmptyPrompt(prompt[0])} placeholder={placeholder} />
    </Box>
  </SectionV2.ActionCollapseSection>
);

export default PromptConfirmSection;
