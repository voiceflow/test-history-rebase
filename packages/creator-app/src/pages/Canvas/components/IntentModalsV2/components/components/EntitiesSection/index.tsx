import { ChatModels } from '@voiceflow/chat-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SvgIcon } from '@voiceflow/ui';
import { VoiceModels } from '@voiceflow/voice-types';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import * as SlotV2 from '@/ducks/slotV2';
import { useSelector } from '@/hooks';

import { SlotBubble } from '../index';
import EntitiesDropdown from './components/EntitiesDropdown';
import SlotItem from './components/SlotItem';

interface EntitiesSectionProps {
  usedSlots: Realtime.IntentSlot[];
  addRequiredSlot: (slotID: string) => void;
  removeRequiredSlot: (slotID: string) => void;
  updateSlotDialog: (slotID: string, prompt: Array<VoiceModels.IntentPrompt<string> & ChatModels.Prompt>) => void;
}

const EntitiesSection: React.FC<EntitiesSectionProps> = ({ updateSlotDialog, removeRequiredSlot, addRequiredSlot, usedSlots }) => {
  const allSlotsMap = useSelector(SlotV2.slotMapSelector);

  const [requiredIntentSlots, notRequiredIntentSlots] = React.useMemo(() => {
    const requiredSlots: Realtime.IntentSlot[] = [];
    const notRequiredSlots: Realtime.IntentSlot[] = [];

    usedSlots.forEach((slot) => {
      if (!slot || !allSlotsMap[slot.id]) return;

      if (slot.required) {
        requiredSlots.push(slot);
      } else {
        notRequiredSlots.push(slot);
      }
    });

    return [requiredSlots, notRequiredSlots];
  }, [usedSlots, allSlotsMap]);

  const hasSlots = !!requiredIntentSlots.length || !!notRequiredIntentSlots.length;

  return (
    <Section
      headerEnd={<EntitiesDropdown addRequiredSlot={addRequiredSlot} />}
      header={<Box fontWeight={hasSlots ? 600 : 'normal'}>Required entities</Box>}
      variant={SectionVariant.PRIMARY}
      customHeaderStyling={{ paddingRight: '20px', paddingBottom: hasSlots ? '16px' : '20px' }}
      customContentStyling={{ padding: '0 32px 0 18px' }}
      forceDividers
    >
      {!!usedSlots.length && (
        <Box marginBottom={16} marginRight={-12}>
          <Box marginTop={-8} marginBottom={8}>
            {requiredIntentSlots.map((slot) => (
              <SlotItem
                updateSlotDialog={updateSlotDialog}
                removeRequiredSlot={removeRequiredSlot}
                key={slot.id}
                slot={slot}
                name={allSlotsMap[slot.id].name}
                required={slot.required}
              />
            ))}
          </Box>
          {!!notRequiredIntentSlots.length && (
            <Box pl={12} pr={12}>
              {notRequiredIntentSlots.map((slot) => (
                <SlotBubble key={slot.id} onClick={() => addRequiredSlot(slot.id)}>
                  <SvgIcon icon="plusSmall" style={{ marginRight: 4 }} />
                  {allSlotsMap[slot.id].name}
                </SlotBubble>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Section>
  );
};

export default EntitiesSection;
