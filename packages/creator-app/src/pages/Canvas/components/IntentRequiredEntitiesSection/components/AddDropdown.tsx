import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, IconButton, IconButtonVariant, NestedMenuComponents, PopperProps, Select } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';

import { useAddSlot } from '@/hooks';

interface AddDropdownProps {
  entities: Realtime.Slot[];
  placement?: PopperProps['placement'];
  onAddRequired: (slotID: string) => void;
  intentEntities: Normal.Normalized<Realtime.IntentSlot>;
}

const AddDropdown: React.FC<AddDropdownProps> = ({ entities, placement, onAddRequired, intentEntities }) => {
  const { onAddSlot } = useAddSlot();

  const unusedEntities = React.useMemo(() => entities.filter((entity) => !Normal.hasOne(intentEntities, entity.id)), [entities, intentEntities]);

  const onCreate = async () => {
    const numberWord = Utils.number.convertToWord(entities.length);
    const newSlot = await onAddSlot(`slot_${numberWord}`);

    if (newSlot) {
      await onAddRequired(newSlot.id);
    }
  };

  return (
    <Select
      options={unusedEntities}
      onSelect={(slot) => onAddRequired(slot.id)}
      minWidth={false}
      creatable={false}
      modifiers={{ offset: { offset: placement === 'bottom-end' ? '10,0' : '-10,0' } }}
      placement={placement}
      isDropdown
      searchable={!!unusedEntities.length}
      renderEmpty={({ close }) => (
        <Box margin="-24px 0" flex={1} textAlign="center">
          <NestedMenuComponents.FooterAction onClick={Utils.functional.chainVoid(close, onCreate)}>
            Create New Entity
          </NestedMenuComponents.FooterAction>
        </Box>
      )}
      minMenuWidth={250}
      renderTrigger={({ ref, onOpenMenu, onHideMenu, isOpen }) => (
        <IconButton
          ref={ref as React.RefObject<HTMLButtonElement>}
          size={16}
          icon="plus"
          onClick={isOpen ? onHideMenu : onOpenMenu}
          variant={IconButtonVariant.BASIC}
          activeClick={isOpen}
        />
      )}
      optionsMaxSize={7.5}
      getOptionLabel={(value) => value?.name}
      inDropdownSearch={!!unusedEntities.length}
      alwaysShowCreate
      renderFooterAction={
        unusedEntities.length
          ? ({ close }) => (
              <NestedMenuComponents.FooterActionContainer onClick={Utils.functional.chainVoid(close, onCreate)}>
                Create New Entity
              </NestedMenuComponents.FooterActionContainer>
            )
          : undefined
      }
      createInputPlaceholder="entities"
    />
  );
};

export default AddDropdown;
