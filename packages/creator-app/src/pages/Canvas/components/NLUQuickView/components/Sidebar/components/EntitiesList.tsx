import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { IconButton, IconButtonVariant, TippyTooltip, toast } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import { InteractionModelTabType } from '@/constants';
import * as IntentDuck from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as SlotDuck from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import { useAddSlot, useDispatch, useSelector } from '@/hooks';
import { NLUQuickViewContext } from '@/pages/Canvas/components/NLUQuickView/context';
import { useFilteredList, useOrderedEntities } from '@/pages/Canvas/components/NLUQuickView/hooks';

import { useSectionHooks } from '../hooks';
import { SectionSection } from './index';
import ListItem from './ListItem';
import { SectionProps } from './types';

const EntitiesList: React.FC<SectionProps> = ({
  isActiveItemRename,
  setIsActiveItemRename,
  setSearchLength,
  selectedID,
  setSelectedItemID,
  search,
  setActiveTab,
}) => {
  const { onAddSlot } = useAddSlot();

  const { activeTab } = React.useContext(NLUQuickViewContext);

  const allSlots = useSelector(SlotV2.allSlotsSelector);
  const allSlotsMap = useSelector(SlotV2.slotMapSelector);
  const getIntentsUsingSlot = useSelector(IntentV2.getIntentsUsingSlotSelector);
  const { nameChangeTransform } = React.useContext(NLUQuickViewContext);

  const deleteSlot = useDispatch(SlotDuck.deleteSlot);
  const removeIntentSlot = useDispatch(IntentDuck.removeIntentSlot);

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
            <IconButton style={{ marginRight: -12 }} onClick={onCreateEntity} variant={IconButtonVariant.BASIC} icon="plus" />
          </TippyTooltip>
        )
      }
    >
      {filteredList.map((slot, index) => (
        <ListItem
          id={slot.id}
          active={selectedID ? selectedID === slot.id : index === 0}
          onClick={() => setSelectedItemID(slot.id)}
          key={slot.id}
          name={slot.name}
          onDelete={onDelete}
          onRename={onRenameSlot}
          nameValidation={nameChangeTransform}
          isActiveItemRename={isActiveItemRename}
          setIsActiveItemRename={setIsActiveItemRename}
        />
      ))}
    </SectionSection>
  );
};

export default EntitiesList;
