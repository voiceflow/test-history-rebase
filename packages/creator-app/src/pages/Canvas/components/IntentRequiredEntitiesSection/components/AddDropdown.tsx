import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { IconButton, IconButtonVariant, Menu, PopperTypes, Select } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { NLUContext } from '@/contexts';
import { useAddSlot } from '@/hooks';

interface AddDropdownProps {
  entities: Realtime.Slot[];
  placement?: PopperTypes.Placement;
  onAddRequired: (slotID: string) => void;
  intentEntities: Normal.Normalized<Realtime.IntentSlot>;
}

const AddDropdown: React.FC<AddDropdownProps> = ({ entities, placement, onAddRequired, intentEntities }) => {
  const { onAddSlot } = useAddSlot();
  const { generateItemName } = React.useContext(NLUContext);

  const unusedEntities = React.useMemo(() => entities.filter((entity) => !Normal.hasOne(intentEntities, entity.id)), [entities, intentEntities]);

  const onCreate = async () => {
    const newSlot = await onAddSlot(generateItemName(InteractionModelTabType.SLOTS));

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
      renderFooterAction={({ close }) => (
        <Menu.Footer noItems={!unusedEntities.length}>
          <Menu.Footer.Action onClick={Utils.functional.chainVoid(close, onCreate)}>Create New Entity</Menu.Footer.Action>
        </Menu.Footer>
      )}
      createInputPlaceholder="entities"
    />
  );
};

export default AddDropdown;
