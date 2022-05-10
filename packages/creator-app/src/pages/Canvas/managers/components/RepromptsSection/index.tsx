import { ChatModels } from '@voiceflow/chat-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { MAX_ALEXA_REPROMPTS, MAX_SYSTEM_MESSAGES_COUNT } from '@/constants';
import { useManager } from '@/hooks';
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
  const mapManagedApi = useManager(reprompts, onChange, {
    getKey: (item) => item.id,
    maxItems: Realtime.Utils.typeGuards.isAlexaPlatform(editor.platform) ? MAX_ALEXA_REPROMPTS : MAX_SYSTEM_MESSAGES_COUNT,
  });

  const isChat = Realtime.Utils.typeGuards.isChatProjectType(editor.projectType);
  const hasReprompts = active && !!mapManagedApi.size;

  return (
    <SectionV2.ActionListSection
      title={<SectionV2.Title bold={hasReprompts}>{title}</SectionV2.Title>}
      action={
        isChat ? (
          <SectionV2.AddButton onClick={() => mapManagedApi.onAdd(chatPromptFactory())} disabled={mapManagedApi.isMaxMatches} />
        ) : (
          <SectionV2.AddButtonDropdown
            actions={[
              { label: 'Speak', onClick: () => mapManagedApi.onAdd(voicePromptFactory()) },
              { label: 'Audio', onClick: () => mapManagedApi.onAdd(voiceAudioPromptFactory()) },
            ]}
            disabled={mapManagedApi.isMaxMatches}
          />
        )
      }
      sticky
    >
      {hasReprompts &&
        mapManagedApi.mapManaged((item, { key, isLast, onUpdate, onRemove }) => (
          <Box key={key} pb={isLast ? 8 : 16}>
            <ListItem
              message={item}
              onChange={onUpdate}
              onRemove={onRemove}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={key === mapManagedApi.latestCreatedKey}
            />
          </Box>
        ))}
    </SectionV2.ActionListSection>
  );
};

export default RepromptsSection;
