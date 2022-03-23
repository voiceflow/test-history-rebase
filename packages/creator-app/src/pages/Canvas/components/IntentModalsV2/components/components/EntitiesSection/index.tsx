import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SvgIcon } from '@voiceflow/ui';
import React, { Ref } from 'react';

import Section, { SectionVariant } from '@/components/Section';
import * as Intent from '@/ducks/intent';
import { useDispatch } from '@/hooks';

import { SlotBubble } from '../index';
import EntitiesDropdown from './components/EntitiesDropdown';
import SlotItem from './components/SlotItem';

interface EntitiesSectionProps {
  slots: Realtime.Slot[];
  intent: Realtime.Intent;
  entitiesVisibleRef: Ref<HTMLDivElement>;
}

const EntitiesSection: React.FC<EntitiesSectionProps> = ({ entitiesVisibleRef, intent, slots }) => {
  const patchIntentSlot = useDispatch(Intent.patchIntentSlot);

  const slotMap = React.useMemo(() => Utils.array.createMap(slots, Utils.object.selectID), [slots]);

  const [requiredIntentSlots, notRequiredIntentSlots] = React.useMemo(() => {
    const requiredSlots: Realtime.IntentSlot[] = [];
    const notRequiredSlots: Realtime.IntentSlot[] = [];

    intent.slots.allKeys.forEach((id) => {
      const slot = intent.slots.byKey[id];

      if (!slot) return;

      if (slot.required) {
        requiredSlots.push(slot);
      } else {
        notRequiredSlots.push(slot);
      }
    });

    return [requiredSlots, notRequiredSlots];
  }, [intent.slots]);

  const hasSlots = !!requiredIntentSlots.length || !!notRequiredIntentSlots.length;

  return (
    <Section
      headerEnd={<EntitiesDropdown intent={intent} />}
      header={<Box fontWeight={hasSlots ? 600 : 'normal'}>Required entities</Box>}
      variant={SectionVariant.PRIMARY}
      customHeaderStyling={{ paddingRight: '20px', paddingBottom: hasSlots ? '16px' : '20px' }}
      customContentStyling={{ padding: '0 32px 0 18px' }}
      forceDividers
    >
      {!!slots.length && (
        <Box marginBottom={16} marginRight={-12}>
          <div ref={entitiesVisibleRef} />
          <Box marginTop={-8} marginBottom={8}>
            {requiredIntentSlots.map((slot) => (
              <SlotItem
                slots={slots}
                key={slot.id}
                intent={intent}
                slot={slot}
                name={slotMap[slot.id].name}
                required={intent.slots.byKey[slot.id].required}
              />
            ))}
          </Box>
          {!!notRequiredIntentSlots.length && (
            <Box pl={12} pr={12}>
              {notRequiredIntentSlots.map((slot) => (
                <SlotBubble key={slot.id} onClick={() => patchIntentSlot(intent.id, slot.id, { required: !slot.required })}>
                  <SvgIcon icon="plusSmall" style={{ marginRight: 4 }} />
                  {slotMap[slot.id].name}
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
