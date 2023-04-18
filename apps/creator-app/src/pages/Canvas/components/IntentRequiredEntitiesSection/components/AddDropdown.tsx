import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Menu, PopperTypes, Select, System } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { NLUContext } from '@/contexts/NLUContext';
import { useAddSlot } from '@/hooks/slot';

interface AddDropdownProps {
  entities: Realtime.Slot[];
  placement?: PopperTypes.Placement;
  onAddRequired: (slotID: string) => void;
  intentEntities: Normal.Normalized<Platform.Base.Models.Intent.Slot>;
}

const AddDropdown: React.FC<AddDropdownProps> = ({ entities, placement, onAddRequired, intentEntities }) => {
  const { onAddSlot } = useAddSlot();
  const { generateItemName } = React.useContext(NLUContext);
  const searchValue = React.useRef<string>('');

  const unusedEntities = React.useMemo(() => entities.filter((entity) => !Normal.hasOne(intentEntities, entity.id)), [entities, intentEntities]);

  const onCreate = async () => {
    const newEntityName = searchValue.current || generateItemName(InteractionModelTabType.SLOTS);

    const newSlot = await onAddSlot(newEntityName);
    searchValue.current = '';

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
        <System.IconButtonsGroup.Base>
          <System.IconButton.Base
            ref={ref as React.RefObject<HTMLButtonElement>}
            icon="plus"
            active={isOpen}
            onClick={isOpen ? onHideMenu : onOpenMenu}
          />
        </System.IconButtonsGroup.Base>
      )}
      optionsMaxSize={7.5}
      getOptionLabel={(value) => value?.name}
      onSearch={(search) => {
        searchValue.current = search;
      }}
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
