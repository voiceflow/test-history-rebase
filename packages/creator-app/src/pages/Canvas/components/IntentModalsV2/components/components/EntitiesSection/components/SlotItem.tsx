import { ChatModels } from '@voiceflow/chat-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Flex, FlexCenter, IconButton, IconButtonVariant, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import { VoiceModels } from '@voiceflow/voice-types';
import React from 'react';

import { ChatPromptForm, VoicePromptForm } from '@/components/IntentSlotForm/components';
import Popper, { PopperContent } from '@/components/Popper';
import Section, { SectionToggleVariant, SectionVariant } from '@/components/Section';
import * as Intent from '@/ducks/intent';
import * as ProjectV2 from '@/ducks/projectV2';
import { useDispatch, useSelector } from '@/hooks';
import { RequiredEntity } from '@/pages/Canvas/components/IntentModalsV2/components/components/EntitiesSection/components/index';
import { hasValidReprompt } from '@/utils/prompt';

interface SlotItemProps {
  slot: Realtime.IntentSlot;
  slots: Realtime.Slot[];
  name: string;
  required: boolean;
  intent: Realtime.Intent;
}

const SlotItem: React.FC<SlotItemProps> = ({ slot, slots, intent, name }) => {
  const removeRequiredSlot = useDispatch(Intent.removeRequiredSlot);
  const patchIntentSlotDialog = useDispatch(Intent.updateIntentSlotDialog);

  const projectType = useSelector(ProjectV2.active.projectTypeSelector);
  const isChat = Realtime.Utils.typeGuards.isChatProjectType(projectType);
  const { prompt } = slot.dialog ?? { prompt: [] };

  const onChangePrompt = (prompt: VoiceModels.IntentPrompt<any>[] | ChatModels.Prompt[]) => {
    patchIntentSlotDialog(intent.id, slot.id, { prompt } as any);
  };

  const onRemoveRequiredSlot = async () => {
    await removeRequiredSlot(intent.id, slot.id);
  };

  const hasSlotError = !hasValidReprompt(slot.dialog.prompt);

  return (
    <Popper
      portalNode={document.body}
      width="350px"
      placement="left-start"
      renderContent={() => (
        <PopperContent>
          <Section
            header="Entity reprompt"
            variant={SectionVariant.PRIMARY}
            headerToggle
            collapseVariant={SectionToggleVariant.ADD_V2}
            customHeaderStyling={{ padding: '20px 24px' }}
            customContentStyling={{ padding: '0 24px' }}
            initialOpen
          >
            <Box mb={24}>
              {isChat ? (
                <ChatPromptForm
                  autofocus
                  slots={slots}
                  prompt={prompt as ChatModels.Prompt[]}
                  onChange={onChangePrompt}
                  placeholder="Enter entity reprompt"
                />
              ) : (
                <VoicePromptForm
                  autofocus
                  slots={slots}
                  prompt={prompt as VoiceModels.IntentPrompt<string>[]}
                  onChange={onChangePrompt}
                  placeholder="Enter entity reprompt"
                />
              )}
            </Box>
          </Section>
        </PopperContent>
      )}
    >
      {({ ref, onToggle, isOpened }) => (
        <Flex>
          <RequiredEntity ref={ref} onClick={onToggle} active={isOpened}>
            <Box display="inline-block" marginRight={12}>
              <FlexCenter style={{ height: '100%' }}>
                {hasSlotError ? (
                  <TippyTooltip title="Prompt is missing">
                    <SvgIcon icon="warning" color="#BF395B" size={16} />
                  </TippyTooltip>
                ) : (
                  <SvgIcon color="#6e849a" icon="entities" />
                )}
              </FlexCenter>
            </Box>
            {name}
          </RequiredEntity>
          <IconButton size={16} style={{ marginRight: 0 }} icon="minus" variant={IconButtonVariant.BASIC} onClick={onRemoveRequiredSlot} />
        </Flex>
      )}
    </Popper>
  );
};

export default SlotItem;
