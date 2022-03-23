import { Utils } from '@voiceflow/common';
import { IconButton, IconButtonVariant, TippyTooltip, toast } from '@voiceflow/ui';
import _sortBy from 'lodash/sortBy';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import { InteractionModelTabType } from '@/constants';
import * as IntentDuck from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as SlotDuck from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import { useAddSlot, useDispatch, useSelector } from '@/hooks';
import { NLUQuickViewContext } from '@/pages/Canvas/components/NLUQuickView/context';

import { useSectionHooks } from '../hooks';
import { SectionSection } from './index';
import ListItem from './ListItem';
import { SectionProps } from './types';

const EntitiesSection: React.FC<SectionProps> = ({
  isActiveItemRename,
  setIsActiveItemRename,
  setSearchLength,
  selectedID,
  setSelectedItemID,
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

  const sortedSlots = React.useMemo(() => _sortBy(allSlots, (slot) => slot.name?.toLowerCase()), [allSlots]);
  const isActiveTab = React.useMemo(() => activeTab === InteractionModelTabType.SLOTS, [activeTab]);

  const { onRenameSlot } = React.useContext(NLUQuickViewContext);

  useSectionHooks({
    setSearchLength,
    listLength: allSlots.length,
    isActiveTab,
    list: sortedSlots,
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
          nameValidation={nameChangeTransform}
          isActiveItemRename={isActiveItemRename}
          setIsActiveItemRename={setIsActiveItemRename}
        />
      ))}
    </SectionSection>
  );
};

export default EntitiesSection;
