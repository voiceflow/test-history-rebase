import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Menu, Select, System } from '@voiceflow/ui';
import React from 'react';

import * as Router from '@/ducks/router';
import * as SlotV2 from '@/ducks/slotV2';
import { NLUManagerOpenedOrigin } from '@/ducks/tracking/constants';
import { useFeature } from '@/hooks/feature';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';

const EntitySelectDropdown: React.FC<{ slotId: string; onSelect: (value: string) => void }> = ({ slotId, onSelect }) => {
  const nluManager = useFeature(Realtime.FeatureFlag.NLU_MANAGER);

  const allSlots = useSelector(SlotV2.allSlotsSelector);
  const goToNLUManager = useDispatch(Router.goToCurrentNLUManager);

  const options = React.useMemo(() => allSlots.map((slot) => ({ id: slot.id, label: slot.name })), [allSlots]);
  const optionsMap = React.useMemo(() => Utils.array.createMap(options, Utils.object.selectID), [options]);

  const handleSelect = (slotID: string | null) => {
    if (slotID) {
      onSelect(slotID);
    }
  };

  return (
    <Select
      value={slotId}
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
      createInputPlaceholder="entities"
      renderFooterAction={() =>
        nluManager.isEnabled ? (
          <Menu.Footer>
            <Menu.Footer.Action onClick={() => goToNLUManager(NLUManagerOpenedOrigin.QUICKVIEW)}>Open NLU Manager</Menu.Footer.Action>
          </Menu.Footer>
        ) : null
      }
      renderTrigger={({ onOpenMenu, onHideMenu, isOpen }) => (
        <System.IconButtonsGroup.Base mr={12}>
          <System.IconButton.Base active={isOpen} icon="sandwichMenu" onClick={isOpen ? onHideMenu : onOpenMenu} />
        </System.IconButtonsGroup.Base>
      )}
    />
  );
};

export default EntitySelectDropdown;
