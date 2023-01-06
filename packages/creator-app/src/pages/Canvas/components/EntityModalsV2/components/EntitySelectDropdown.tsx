import { Nullish, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, IconButton, IconButtonVariant, Menu, Select } from '@voiceflow/ui';
import React from 'react';

import { ModalType } from '@/constants';
import * as Router from '@/ducks/router';
import * as SlotV2 from '@/ducks/slotV2';
import { NLUManagerOpenedOrigin } from '@/ducks/tracking/constants';
import { useDispatch, useFeature, useModals, useSelector } from '@/hooks';

const EntitySelectDropdown: React.OldFC = () => {
  const { close, open } = useModals(ModalType.ENTITY_EDIT);
  const nluManager = useFeature(Realtime.FeatureFlag.NLU_MANAGER);

  const allSlots = useSelector(SlotV2.allSlotsSelector);
  const goToNLUManager = useDispatch(Router.goToCurrentNLUManager);

  const options = React.useMemo(() => allSlots.map((slot) => ({ id: slot.id, label: slot.name })), [allSlots]);
  const optionsMap = React.useMemo(() => Utils.array.createMap(options, Utils.object.selectID), [options]);

  const handleSelect = (slotID: string | null) => {
    close();

    if (slotID) {
      open({ id: slotID });
    }
  };

  return (
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
      createInputPlaceholder="entities"
      renderFooterAction={() =>
        nluManager.isEnabled ? (
          <Menu.Footer>
            <Menu.Footer.Action onClick={() => goToNLUManager(NLUManagerOpenedOrigin.QUICKVIEW)}>Open NLU Manager</Menu.Footer.Action>
          </Menu.Footer>
        ) : null
      }
      renderTrigger={({ onOpenMenu, onHideMenu, isOpen }) => (
        <Box onClick={isOpen ? onHideMenu : onOpenMenu} display="flex">
          <IconButton activeClick={isOpen} variant={IconButtonVariant.BASIC} icon="sandwichMenu" size={16} style={{ marginRight: '12px' }} />
        </Box>
      )}
    />
  );
};

export default EntitySelectDropdown;
