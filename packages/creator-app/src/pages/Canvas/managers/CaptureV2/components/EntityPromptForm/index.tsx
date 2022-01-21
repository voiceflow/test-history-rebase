import * as Realtime from '@voiceflow/realtime-sdk';
import immer from 'immer';
import React from 'react';

import { ChatPromptForm, SlotPromptTooltip, VoicePromptForm } from '@/components/IntentSlotForm/components';
import Section from '@/components/Section';
import * as SlotV2 from '@/ducks/slotV2';
import { useSelector } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';
import { isChatbotPlatform } from '@/utils/typeGuards';

export const ENTITY_PROMPT_PATH_TYPE = 'entityPrompt';

const EntityPromptForm: React.FC<NodeEditorPropsType<Realtime.NodeData.CaptureV2>> = ({ data, onChange, activePath, platform }) => {
  const isChatbot = isChatbotPlatform(platform);
  const getSlotByID = useSelector(SlotV2.getSlotByIDSelector);

  const slots = data.intent?.slots || [];
  const slotID = activePath.id;

  const slotIDs = React.useMemo(() => slots.map(({ id }) => id), [slots]);
  const usedSlots = React.useMemo(() => slotIDs.map((id) => getSlotByID(id)).filter((slot): slot is Realtime.Slot => !!slot), [slotIDs.join('')]);

  const slot = slots.find(({ id }) => id === slotID);

  const onChangePrompt = React.useCallback(
    (prompt: any) => {
      if (!data.intent) return;
      const slots = immer(data.intent.slots, (draft) => {
        const index = draft.findIndex(({ id }) => id === slotID);
        draft[index].dialog.prompt = prompt;
      });
      onChange({ intent: { slots } });
    },
    [data, onChange]
  );

  return (
    <Section header="Entity Reprompt" tooltip={<SlotPromptTooltip />}>
      <FormControl>
        {isChatbot ? (
          <ChatPromptForm
            slots={usedSlots}
            prompt={slot?.dialog.prompt as any}
            onChange={onChangePrompt}
            placeholder="What question will we ask the user to fill this entity?"
          />
        ) : (
          <VoicePromptForm
            slots={usedSlots}
            prompt={slot?.dialog.prompt as any}
            onChange={onChangePrompt}
            placeholder="What question will we ask the user to fill this entity?"
          />
        )}
      </FormControl>
    </Section>
  );
};

export default EntityPromptForm;
