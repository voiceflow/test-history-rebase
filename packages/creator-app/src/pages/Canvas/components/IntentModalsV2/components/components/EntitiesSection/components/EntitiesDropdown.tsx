import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, IconButton, IconButtonVariant, NestedMenuComponents, Select } from '@voiceflow/ui';
import React from 'react';

import * as SlotV2 from '@/ducks/slotV2';
import { useSelector } from '@/hooks';

const EntitiesDropdown: React.FC = () => {
  const allSlots = useSelector(SlotV2.allSlotsSelector);

  const onSlotSelect = (entity: Realtime.Slot) => {
    alert(`Placeholder: ${entity.name}`);
  };

  return (
    <Select
      options={allSlots}
      onSelect={onSlotSelect}
      minMenuWidth={250}
      optionsMaxSize={7.5}
      inDropdownSearch
      isDropdown
      searchable
      placeholder="Ent"
      getOptionValue={(option) => option}
      getOptionLabel={(value) => value?.name}
      minWidth={false}
      alwaysShowCreate
      creatable={false}
      createInputPlaceholder="Entities"
      renderFooterAction={({ close }) => (
        <NestedMenuComponents.FooterActionContainer onClick={Utils.functional.chainVoid(close)}>
          Create New Entity
        </NestedMenuComponents.FooterActionContainer>
      )}
      renderTrigger={({ onOpenMenu, onHideMenu, isOpen }) => (
        <Box display="flex" mr={10}>
          <IconButton onClick={isOpen ? onHideMenu : onOpenMenu} variant={IconButtonVariant.BASIC} size={16} icon="plus" />
        </Box>
      )}
    />
  );
};

export default EntitiesDropdown;
