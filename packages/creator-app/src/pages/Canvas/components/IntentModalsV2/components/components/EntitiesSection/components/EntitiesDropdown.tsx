import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, IconButton, IconButtonVariant, NestedMenuComponents, Select } from '@voiceflow/ui';
import React from 'react';

import Popper from '@/components/Popper';
import * as Intent from '@/ducks/intent';
import * as SlotV2 from '@/ducks/slotV2';
import { useAddSlot, useDispatch, useSelector } from '@/hooks';

const EntitiesDropdown: React.FC<{ intent: Realtime.Intent }> = ({ intent }) => {
  const allSlots = useSelector(SlotV2.allSlotsSelector);
  const { onAddSlot } = useAddSlot();
  const addRequiredSlot = useDispatch(Intent.addRequiredSlot);

  const onSlotSelect = async (entity: Realtime.Slot) => {
    await addRequiredSlot(intent.id, entity.id);
  };

  const handleCreateClick = async () => {
    const numberWord = Utils.number.convertToWord(allSlots.length);
    const newSlot = await onAddSlot(`slot_${numberWord}`);
    if (newSlot) {
      await onSlotSelect(newSlot);
    }
  };

  const addButton = (onToggle: () => void, isOpened: boolean, ref?: React.Ref<any>) => (
    <Box ref={ref} display="flex" mr={10}>
      <IconButton onClick={onToggle} variant={IconButtonVariant.BASIC} activeHover={isOpened} size={16} icon="plus" />
    </Box>
  );

  if (!allSlots.length) {
    return (
      <Popper
        width="250px"
        placement="right-start"
        portalNode={document.body}
        renderContent={({ onToggle }) => (
          <Box height={70}>
            <NestedMenuComponents.FooterActionContainer onClick={Utils.functional.chainVoid(onToggle, handleCreateClick)}>
              Create New Entity
            </NestedMenuComponents.FooterActionContainer>
          </Box>
        )}
      >
        {({ onToggle, isOpened, ref }) => addButton(onToggle, isOpened, ref)}
      </Popper>
    );
  }

  return (
    <Select
      options={allSlots}
      onSelect={onSlotSelect}
      minMenuWidth={250}
      optionsMaxSize={7.5}
      inDropdownSearch
      isDropdown
      searchable
      getOptionValue={(option) => option}
      getOptionLabel={(value) => value?.name}
      minWidth={false}
      alwaysShowCreate
      creatable={false}
      createInputPlaceholder="Entities"
      renderFooterAction={({ close }) => (
        <NestedMenuComponents.FooterActionContainer onClick={Utils.functional.chainVoid(close, handleCreateClick)}>
          Create New Entity
        </NestedMenuComponents.FooterActionContainer>
      )}
      renderTrigger={({ onOpenMenu, onHideMenu, isOpen }) => addButton(() => (isOpen ? onHideMenu?.() : onOpenMenu?.()), isOpen)}
    />
  );
};

export default EntitiesDropdown;
