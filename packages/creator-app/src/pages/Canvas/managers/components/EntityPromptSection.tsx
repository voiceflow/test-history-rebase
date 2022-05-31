import { ChatModels } from '@voiceflow/chat-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import { VoiceModels } from '@voiceflow/voice-types';
import React from 'react';

import PromptForm from '@/components/PromptForm';
import { isEmptyPrompt } from '@/utils/prompt';

interface EntityPromptSectionProps {
  title: string;
  onAdd: VoidFunction;
  prompt: ChatModels.Prompt[] | VoiceModels.IntentPrompt<string>[];
  onRemove: VoidFunction;
  onChange: (prompt: ChatModels.Prompt[] | VoiceModels.IntentPrompt<string>[]) => void;
  collapsed: boolean;
  placeholder: string;
  intentEntities: Realtime.Slot[];
}

const EntityPromptSection: React.FC<EntityPromptSectionProps> = ({
  title,
  onAdd,
  prompt,
  onChange,
  onRemove,
  collapsed,
  placeholder,
  intentEntities,
}) => {
  const removingRef = React.useRef(false);

  // there's a rase condition when removing a prompt and onChange event is triggered
  // so we need to check if we are removing a prompt and if so, we need to ignore the onChange event
  const setRemovingRef = (value: boolean) => () => {
    removingRef.current = value;
  };

  return (
    <SectionV2.ActionCollapseSection
      title={<SectionV2.Title bold={!collapsed}>{title}</SectionV2.Title>}
      action={
        collapsed ? (
          <SectionV2.AddButton onClick={Utils.functional.chain(setRemovingRef(false), onAdd)} />
        ) : (
          <SectionV2.RemoveButton onClick={Utils.functional.chain(setRemovingRef(true), onRemove)} />
        )
      }
      collapsed={collapsed}
      contentProps={{ bottomOffset: 2.5 }}
    >
      <PromptForm
        slots={intentEntities}
        prompt={prompt}
        onChange={(prompt) => !removingRef.current && onChange(prompt)}
        autofocus={isEmptyPrompt(prompt[0])}
        placeholder={placeholder}
      />
    </SectionV2.ActionCollapseSection>
  );
};

export default EntityPromptSection;
