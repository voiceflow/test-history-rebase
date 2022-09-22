import { Nullable } from '@voiceflow/common';
import { Box, IconButton } from '@voiceflow/ui';
import React from 'react';

import IntentSelect from '@/components/IntentSelect';
import { ModalType } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import { useModals } from '@/hooks';

const IntentSelectDropdown: React.FC = () => {
  const { open: openCreateIntentModal, close: closeCreateIntentModal } = useModals(ModalType.INTENT_CREATE);

  const switchIntent = (value: { intent: Nullable<string> }) => {
    const intentID = value?.intent;
    closeCreateIntentModal();
    openCreateIntentModal({
      id: intentID,
      creationType: Tracking.CanvasCreationType.EDITOR,
      utteranceCreationType: Tracking.CanvasCreationType.QUICKVIEW,
    });
  };

  return (
    <>
      <IntentSelect
        minWidth={false}
        onChange={switchIntent}
        creatable={false}
        placement="left-start"
        noBuiltIns
        isDropdown
        modifiers={{ offset: { enabled: true, offset: '-10px,10px' } }}
        minMenuWidth={250}
        optionsMaxSize={7.5}
        alwaysShowCreate
        inDropdownSearch
        createInputPlaceholder="Intents"
        renderTrigger={({ ref, isEmpty, onOpenMenu, onHideMenu, isOpen }) => (
          <Box display="flex" mr={18}>
            <IconButton
              ref={ref as React.RefObject<HTMLButtonElement>}
              size={16}
              icon="sandwichMenu"
              onClick={isOpen ? onHideMenu : onOpenMenu}
              variant={IconButton.Variant.BASIC}
              disabled={isEmpty}
              activeClick={isOpen}
            />
          </Box>
        )}
      />
    </>
  );
};

export default IntentSelectDropdown;
