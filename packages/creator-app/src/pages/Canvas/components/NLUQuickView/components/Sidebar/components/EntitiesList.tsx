import { Utils } from '@voiceflow/common';
import { CustomSlot } from '@voiceflow/common/build/common/constants/slot';
import * as Realtime from '@voiceflow/realtime-sdk';
import { IconButton, IconButtonVariant, TippyTooltip, toast } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import { InteractionModelTabType } from '@/constants';
import * as IntentDuck from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as Slot from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import { useAsyncEffect, useDispatch, useSelector } from '@/hooks';
import { NLUQuickViewContext } from '@/pages/Canvas/components/NLUQuickView/context';
import { useFilteredList, useOrderedEntities } from '@/pages/Canvas/components/NLUQuickView/hooks';

import { useCreatingItem, useSectionHooks } from '../hooks';
import { SectionSection } from './index';
import ListItem from './ListItem';
import { SectionProps } from './types';

const EntitiesList: React.FC<SectionProps> = ({ isActiveItemRename, setIsActiveItemRename, setSearchLength, selectedID, search, setActiveTab }) => {
  const { activeTab, setSelectedID, setIsCreatingItem } = React.useContext(NLUQuickViewContext);

  const allSlots = useSelector(SlotV2.allSlotsSelector);
  const allSlotsMap = useSelector(SlotV2.slotMapSelector);
  const getIntentsUsingSlot = useSelector(IntentV2.getIntentsUsingSlotSelector);
  const { nameChangeTransform, forceNewInlineEntity } = React.useContext(NLUQuickViewContext);

  const deleteSlot = useDispatch(Slot.deleteSlot);
  const removeIntentSlot = useDispatch(IntentDuck.removeIntentSlot);
  const createSlot = useDispatch(Slot.createSlot);

  const { sortedSlots } = useOrderedEntities();
  const filteredList = useFilteredList(search, sortedSlots) as Realtime.Slot[];

  const isActiveTab = React.useMemo(() => activeTab === InteractionModelTabType.SLOTS, [activeTab]);

  const { onRenameSlot } = React.useContext(NLUQuickViewContext);

  useSectionHooks({
    setSearchLength,
    listLength: allSlots.length,
    isActiveTab,
    map: allSlotsMap,
  });

  const onDelete = React.useCallback((slotID) => {
    const activeIntents = getIntentsUsingSlot({ id: slotID });

    if (activeIntents.length > 0) {
      activeIntents.forEach((intent) => removeIntentSlot(intent.id, slotID));

      toast.info('Utterances containing this entity have been modified to remove the slot reference.');
    }

    deleteSlot(slotID);
  }, []);

  const handleConfirmNewSlotName = React.useCallback(
    (newName: string, newSlotID: string) => {
      if (allSlots.some(({ name, id }) => name === newName && newSlotID !== id)) {
        throw new Error('Slot name already in use, use a different name');
      } else {
        onRenameSlot(newName, newSlotID!);
        resetCreating();
      }
    },
    [allSlots]
  );

  const {
    createNewItemComponent,
    newItemID: newSlotID,
    setNewItemID: setNewSlotID,
    isCreating,
    setIsCreating,
    resetCreating,
  } = useCreatingItem({
    itemMap: allSlotsMap,
    nameValidation: (name) => nameChangeTransform(name, InteractionModelTabType.INTENTS),
    onBlur: handleConfirmNewSlotName,
    forceCreate: forceNewInlineEntity,
  });

  useAsyncEffect(async () => {
    if (isCreating) {
      const numberWord = Utils.number.convertToWord(allSlots.length);
      const id = Utils.id.cuid.slug();
      try {
        await createSlot(id, { id, name: `slot_${numberWord}`, inputs: [], type: CustomSlot.type, color: undefined });
        setNewSlotID(id);
        setSelectedID(id);
      } catch (e) {
        toast.error(e);
      } finally {
        setIsCreatingItem(false);
      }
    }
  }, [isCreating]);

  const triggerCreate = () => {
    setIsCreating(true);
    setIsCreatingItem(true);
  };

  return (
    <SectionSection
      isExpanded={isActiveTab && !!filteredList.length}
      isCollapsed={!isActiveTab}
      onClick={() => setActiveTab(InteractionModelTabType.SLOTS)}
      header="Entities"
      headerToggle
      collapseVariant={isActiveTab ? null : SectionToggleVariant.ARROW}
      suffix={
        isActiveTab && (
          <TippyTooltip title="Create entity" position="top">
            <IconButton style={{ marginRight: -12 }} onClick={triggerCreate} variant={IconButtonVariant.BASIC} icon="plus" />
          </TippyTooltip>
        )
      }
    >
      {createNewItemComponent()}
      {filteredList.map((slot) =>
        slot.id === newSlotID ? null : (
          <ListItem
            id={slot.id}
            type={InteractionModelTabType.SLOTS}
            active={selectedID === slot.id}
            onClick={() => setSelectedID(slot.id)}
            key={slot.id}
            name={slot.name}
            onDelete={onDelete}
            onRename={onRenameSlot}
            nameValidation={(name) => nameChangeTransform(name, InteractionModelTabType.SLOTS)}
            isActiveItemRename={isActiveItemRename}
            setIsActiveItemRename={setIsActiveItemRename}
          />
        )
      )}
    </SectionSection>
  );
};

export default EntitiesList;
