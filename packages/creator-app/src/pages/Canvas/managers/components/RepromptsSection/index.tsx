import { ChatModels } from '@voiceflow/chat-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { MAX_ALEXA_REPROMPTS, MAX_SYSTEM_MESSAGES_COUNT } from '@/constants';
import * as VersionV2 from '@/ducks/versionV2';
import { useMapManager, useSelector } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { chatPromptFactory, voiceAudioPromptFactory, voicePromptFactory } from '@/utils/prompt';

import { ListItem } from './components';

interface RepromptsSectionProps {
  title: string;
  active: boolean;
  onChange: (reprompts: Array<ChatModels.Prompt | Realtime.NodeData.VoicePrompt>) => Promise<void>;
  reprompts: Array<ChatModels.Prompt | Realtime.NodeData.VoicePrompt>;
  isRandomized: boolean;
}

const RepromptsSection: React.FC<RepromptsSectionProps> = ({ title, active, reprompts, onChange }) => {
  const editor = EditorV2.useEditor();
  const defaultVoice = useSelector(VersionV2.active.defaultVoiceSelector);
  const mapManager = useMapManager(reprompts, onChange, {
    getKey: (item) => item.id,
    maxItems: Realtime.Utils.typeGuards.isAlexaPlatform(editor.platform) ? MAX_ALEXA_REPROMPTS : MAX_SYSTEM_MESSAGES_COUNT,
  });

  const isChat = Realtime.Utils.typeGuards.isChatProjectType(editor.projectType);
  const hasReprompts = active && !!mapManager.size;

  return (
    <SectionV2.ActionListSection
      title={<SectionV2.Title bold={hasReprompts}>{title}</SectionV2.Title>}
      action={
        isChat ? (
          <SectionV2.AddButton onClick={() => mapManager.onAdd(chatPromptFactory())} disabled={mapManager.isMaxReached} />
        ) : (
          <SectionV2.AddButtonDropdown
            actions={[
              { label: 'Speak', onClick: () => mapManager.onAdd(voicePromptFactory({ defaultVoice })) },
              { label: 'Audio', onClick: () => mapManager.onAdd(voiceAudioPromptFactory()) },
            ]}
            disabled={mapManager.isMaxReached}
          />
        )
      }
      sticky
      contentProps={{ bottomOffset: 2.5 }}
    >
      {hasReprompts &&
        mapManager.map((item, { key, isLast, onUpdate, onRemove }) => (
          <Box key={key} pb={isLast ? 0 : 16}>
            <ListItem message={item} onChange={onUpdate} onRemove={onRemove} autoFocus={key === mapManager.latestCreatedKey} />
          </Box>
        ))}
    </SectionV2.ActionListSection>
  );
};

export default RepromptsSection;
