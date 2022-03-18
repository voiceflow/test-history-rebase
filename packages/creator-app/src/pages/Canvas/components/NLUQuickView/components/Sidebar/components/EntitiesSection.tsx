import { Utils } from '@voiceflow/common';
import { IconButton, IconButtonVariant, TippyTooltip, toast } from '@voiceflow/ui';
import _sortBy from 'lodash/sortBy';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import { CUSTOM_SLOT_TYPE, InteractionModelTabType } from '@/constants';
import * as IntentDuck from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as SlotDuck from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import { useAddSlot, useDispatch, useSelector } from '@/hooks';
import { generateSlotInput } from '@/pages/Canvas/components/SlotEdit/utils';
import { validateSlotName } from '@/utils/slot';

import { useSectionHooks } from '../hooks';
import { SectionSection } from './index';
import ListItem from './ListItem';
import { SectionProps } from './types';

const EntitiesSection: React.FC<SectionProps> = ({
  isActiveItemRename,
  setIsActiveItemRename,
  setTitle,
  setSearchLength,
  selectedID,
  setSelectedItemID,
  setActiveTab,
  activeTab,
}) => {
  const { onAddSlot } = useAddSlot();

  const allSlots = useSelector(SlotV2.allSlotsSelector);
  const allSlotsMap = useSelector(SlotV2.slotMapSelector);
  const allIntents = useSelector(IntentV2.allCustomIntentsSelector);
  const getIntentsUsingSlot = useSelector(IntentV2.getIntentsUsingSlotSelector);

  const deleteSlot = useDispatch(SlotDuck.deleteSlot);
  const removeIntentSlot = useDispatch(IntentDuck.removeIntentSlot);
  const patchSlot = useDispatch(SlotDuck.patchSlot);

  const sortedSlots = React.useMemo(() => _sortBy(allSlots, (slot) => slot.name?.toLowerCase()), [allSlots]);
  const isActiveTab = React.useMemo(() => activeTab === InteractionModelTabType.SLOTS, [activeTab]);

  useSectionHooks({
    setSearchLength,
    listLength: allSlots.length,
    isActiveTab,
    selectedID,
    setSelectedItemID,
    list: sortedSlots,
    map: allSlotsMap,
    setTitle,
  });

  const onCreateEntity = async () => {
    const numberWord = Utils.number.convertToWord(allSlots.length);
    const newSlot = await onAddSlot(`slot_${numberWord}`);
    if (newSlot) {
      setSelectedItemID(newSlot.id);
    }
  };

  const onDelete = React.useCallback((slotID) => {
    const activeIntents = getIntentsUsingSlot({ id: slotID });

    if (activeIntents.length > 0) {
      activeIntents.forEach((intent) => removeIntentSlot(intent.id, slotID));

      toast.info('Utterances containing this entity have been modified to remove the slot reference.');
    }

    deleteSlot(slotID);
  }, []);

  const onRenameSlot = async (slotName: string, id: string) => {
    const formattedSlotName = Utils.string.removeTrailingUnderscores(slotName);

    const slot = allSlotsMap[id];

    const { inputs } = slot;
    const customLines = inputs?.length ? inputs : (slot.type === CUSTOM_SLOT_TYPE && [generateSlotInput()]) || inputs;
    const notEmptyValues = customLines.some(({ value, synonyms }) => value.trim() || synonyms.trim());

    const error = validateSlotName({
      slots: allSlots.filter((slot) => slot.id !== id),
      intents: allIntents,
      slotName: formattedSlotName,
      slotType: slot.type!,
      notEmptyValues,
    });

    if (error) {
      toast.error(error);
      return;
    }

    await patchSlot?.(id, {
      name: formattedSlotName,
    });
  };

  return (
    <SectionSection
      isExpanded={isActiveTab && !!sortedSlots.length}
      isCollapsed={!isActiveTab}
      onClick={() => setActiveTab(InteractionModelTabType.SLOTS)}
      header="Entities"
      headerToggle
      collapseVariant={isActiveTab ? null : SectionToggleVariant.ARROW}
      suffix={
        isActiveTab && (
          <TippyTooltip title="Create entity" position="top">
            <IconButton style={{ marginRight: -12 }} onClick={onCreateEntity} variant={IconButtonVariant.BASIC} icon="plus" />
          </TippyTooltip>
        )
      }
    >
      {sortedSlots.map((slot) => (
        <ListItem
          id={slot.id}
          active={selectedID === slot.id}
          onClick={() => setSelectedItemID(slot.id)}
          key={slot.id}
          name={slot.name}
          onDelete={onDelete}
          onRename={onRenameSlot}
          nameValidation={(name) => name}
          isActiveItemRename={isActiveItemRename}
          setIsActiveItemRename={setIsActiveItemRename}
          activeTab={activeTab}
        />
      ))}
    </SectionSection>
  );
};

export default EntitiesSection;
