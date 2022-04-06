import { ChatModels } from '@voiceflow/chat-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Flex, FlexCenter, IconButton, IconButtonVariant, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import { VoiceModels } from '@voiceflow/voice-types';
import React from 'react';

import { ChatPromptForm, VoicePromptForm } from '@/components/IntentSlotForm/components';
import Popper, { PopperContent } from '@/components/Popper';
import Section, { SectionToggleVariant, SectionVariant } from '@/components/Section';
import { TextEditorVariablesPopoverProvider } from '@/contexts';
import * as ProjectV2 from '@/ducks/projectV2';
import * as SlotV2 from '@/ducks/slotV2';
import { useSelector } from '@/hooks';
import { RequiredEntity } from '@/pages/Canvas/components/IntentModalsV2/components/components/EntitiesSection/components/index';
import { hasValidReprompt } from '@/utils/prompt';

interface SlotItemProps {
  slot: Realtime.IntentSlot;
  name: string;
  required: boolean;
  removeRequiredSlot: (slotID: string) => void;
  updateSlotDialog: (slotID: string, prompt: Array<VoiceModels.IntentPrompt<string> & ChatModels.Prompt>) => void;
}

const SlotItem: React.FC<SlotItemProps> = ({ updateSlotDialog, removeRequiredSlot, slot, name }) => {
  const projectType = useSelector(ProjectV2.active.projectTypeSelector);
  const isChat = Realtime.Utils.typeGuards.isChatProjectType(projectType);
  const { prompt } = slot.dialog ?? { prompt: [] };
  const allSlots = useSelector(SlotV2.allSlotsSelector);

  const onChangePrompt = (prompt: Array<VoiceModels.IntentPrompt<string> & ChatModels.Prompt>) => {
    updateSlotDialog(slot.id, prompt);
  };

  const onRemoveRequiredSlot = async () => {
    await removeRequiredSlot(slot.id);
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
            <TextEditorVariablesPopoverProvider value={document.body}>
              <Box mb={24}>
                {isChat ? (
                  <ChatPromptForm
                    autofocus
                    slots={allSlots}
                    prompt={prompt as ChatModels.Prompt[]}
                    onChange={(prompt) => onChangePrompt(prompt as Array<VoiceModels.IntentPrompt<string> & ChatModels.Prompt>)}
                    placeholder="Enter entity reprompt"
                  />
                ) : (
                  <VoicePromptForm
                    autofocus
                    slots={allSlots}
                    prompt={prompt as VoiceModels.IntentPrompt<string>[]}
                    onChange={(prompt) => onChangePrompt(prompt as Array<VoiceModels.IntentPrompt<string> & ChatModels.Prompt>)}
                    placeholder="Enter entity reprompt"
                  />
                )}
              </Box>
            </TextEditorVariablesPopoverProvider>
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
