import { Nullish, Utils } from '@voiceflow/common';
import { Box, IconButton, IconButtonVariant, NestedMenuComponents, Select } from '@voiceflow/ui';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import { ModalType } from '@/constants';
import * as SlotV2 from '@/ducks/slotV2';
import { useFeature, useModals, useSelector } from '@/hooks';

const EntitySelectDropdown: React.FC = () => {
  const { close, open } = useModals(ModalType.ENTITY_EDIT);
  const nluManager = useFeature(FeatureFlag.NLU_MANAGER);
  const allSlots = useSelector(SlotV2.allSlotsSelector);

  const options = React.useMemo(() => allSlots.map((slot) => ({ id: slot.id, label: slot.name })), [allSlots]);
  const optionsMap = React.useMemo(() => Utils.array.createMap(options, Utils.object.selectID), [options]);

  const onOpenNLU = () => {
    // TODO: Open NLU manager
  };

  const handleSelect = (slotID: string | null) => {
    close();
    slotID && open({ id: slotID });
  };

  const footerComponent = nluManager.isEnabled
    ? () => <NestedMenuComponents.FooterActionContainer onClick={onOpenNLU}>Open NLU Manager</NestedMenuComponents.FooterActionContainer>
    : null;

  return (
    <>
      <Select
        value={null as Nullish<string>}
        options={options}
        minWidth={false}
        onSelect={handleSelect}
        placement="left-start"
        isDropdown
        searchable
        placeholder="Name new entity or select existing entity"
        minMenuWidth={250}
        getOptionLabel={(value) => value && optionsMap[value]?.label}
        getOptionValue={(option) => option?.id}
        optionsMaxSize={7.5}
        inDropdownSearch
        alwaysShowCreate
        createInputPlaceholder="Slots"
        renderFooterAction={footerComponent}
        renderTrigger={({ onOpenMenu, onHideMenu, isOpen }) => (
          <Box onClick={isOpen ? onHideMenu : onOpenMenu} display="flex">
            <IconButton activeClick={isOpen} variant={IconButtonVariant.BASIC} icon="sandwichMenu" size={16} style={{ marginRight: '12px' }} />
          </Box>
        )}
      />
    </>
  );
};

export default EntitySelectDropdown;
