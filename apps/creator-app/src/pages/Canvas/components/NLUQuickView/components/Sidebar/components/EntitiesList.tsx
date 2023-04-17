import { CustomSlot, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { COLOR_PICKER_CONSTANTS, pickRandomDefaultColor, System, TippyTooltip, toast } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import { InteractionModelTabType } from '@/constants';
import { NLUContext } from '@/contexts/NLUContext';
import * as Slot from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import * as Tracking from '@/ducks/tracking';
import { useAsyncEffect, useDispatch, useOrderedEntities, useSelector, useTrackingEvents } from '@/hooks';
import { NLUQuickViewContext } from '@/pages/Canvas/components/NLUQuickView/context';
import { useFilteredList } from '@/pages/Canvas/components/NLUQuickView/hooks';
import { getErrorMessage } from '@/utils/error';

import { useCreatingItem, useListHooks } from '../hooks';
import { SectionSection } from './index';
import ListItem from './ListItem';
import { SectionProps } from './types';

const EntitiesList: React.FC<SectionProps> = ({ isActiveItemRename, setIsActiveItemRename, setSearchLength, selectedID, search, setActiveTab }) => {
  const { activeTab, setSelectedID, setIsCreatingItem, nameChangeTransform, forceNewInlineEntity } = React.useContext(NLUQuickViewContext);

  const allSlots = useSelector(SlotV2.allSlotsSelector);
  const allSlotsMap = useSelector(SlotV2.slotMapSelector);

  const createSlot = useDispatch(Slot.createSlot);
  const [trackingEvents] = useTrackingEvents();

  const sortedSlots = useOrderedEntities();
  const filteredList = useFilteredList(search, sortedSlots) as Realtime.Slot[];
  const firstItem = React.useMemo(() => filteredList.find((item) => item.id), [filteredList]);

  const isActiveTab = React.useMemo(() => activeTab === InteractionModelTabType.SLOTS, [activeTab]);
  const { renameItem, generateItemName } = React.useContext(NLUContext);

  useListHooks({
    setSearchLength,
    listLength: allSlots.length,
    isActiveTab,
    map: allSlotsMap,
  });

  const handleConfirmNewSlotName = React.useCallback(
    (newName: string, newSlotID: string) => {
      if (allSlots.some(({ name, id }) => name === newName && newSlotID !== id)) {
        renameItem(`${newName}_two`, newSlotID!, InteractionModelTabType.SLOTS);
        toast.error('Slot name already in use, use a different name');
      } else {
        renameItem(newName, newSlotID!, InteractionModelTabType.SLOTS);
      }
      resetCreating();
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
    nameValidation: (name) => nameChangeTransform(name, InteractionModelTabType.SLOTS),
    onBlur: handleConfirmNewSlotName,
    forceCreate: forceNewInlineEntity,
  });

  useAsyncEffect(async () => {
    if (isCreating) {
      const id = Utils.id.cuid.slug();
      try {
        await createSlot(id, {
          id,
          name: generateItemName(InteractionModelTabType.SLOTS),
          inputs: [],
          type: CustomSlot.type,
          color: pickRandomDefaultColor(COLOR_PICKER_CONSTANTS.ALL_COLORS_WITH_DARK_BASE),
        });
        setNewSlotID(id);
        setSelectedID(id);
        trackingEvents.trackEntityCreated({ creationType: Tracking.CanvasCreationType.IMM });
      } catch (e) {
        toast.error(getErrorMessage(e));
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
          <TippyTooltip content="Create entity" position="top">
            <System.IconButtonsGroup.Base mr={-12}>
              <System.IconButton.Base icon="plus" onClick={triggerCreate} />
            </System.IconButtonsGroup.Base>
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
            onRename={(name, id) => renameItem(name, id, InteractionModelTabType.SLOTS)}
            onDelete={() => selectedID === slot.id && firstItem && setSelectedID(firstItem.id)}
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
