import { Box, IconButton, IconButtonVariant, NestedMenuComponents, Select } from '@voiceflow/ui';
import React from 'react';

import { ModalType } from '@/constants';
import * as SlotV2 from '@/ducks/slotV2';
import { useModals, useSelector } from '@/hooks';

const EntitySelectDropdown: React.FC = () => {
  const { close, open } = useModals(ModalType.ENTITY_EDIT);

  const allSlots = useSelector(SlotV2.allSlotsSelector);
  const allSlotsMap = useSelector(SlotV2.slotMapSelector);

  const slotOptions = React.useMemo(() => {
    return allSlots.map((slot) => ({
      id: slot.id,
      label: slot.name,
    }));
  }, [allSlots]);

  const onSelectSlot = (slotID: string) => {
    close();
    open({ id: slotID });
  };

  const getOptionLabel = (slotID?: string | null) => (slotID ? allSlotsMap[slotID]?.name : '');

  const getOptionValue = (value?: { id: string } | null) => value?.id;

  return (
    <>
      <Select
        minMenuWidth={250}
        optionsMaxSize={7.5}
        minWidth={false}
        createInputPlaceholder="Slots"
        inDropdownSearch
        isDropdown
        placement="left-start"
        options={slotOptions}
        onSelect={onSelectSlot}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        searchable
        alwaysShowCreate
        creatable={false}
        placeholder="Name new entity or select existing entity"
        footerAction={() => (
          <NestedMenuComponents.FooterActionContainer
            onClick={() => {
              // TODO Open NLU manager
            }}
          >
            Open NLU Manager
          </NestedMenuComponents.FooterActionContainer>
        )}
        triggerRenderer={({ onOpenMenu, onHideMenu, isOpen }) => {
          return (
            <Box onClick={isOpen ? onHideMenu : onOpenMenu} display="flex">
              <IconButton activeClick={isOpen} variant={IconButtonVariant.BASIC} icon="sandwichMenu" size={16} style={{ marginRight: '12px' }} />
            </Box>
          );
        }}
      />
    </>
  );
};

export default EntitySelectDropdown;
