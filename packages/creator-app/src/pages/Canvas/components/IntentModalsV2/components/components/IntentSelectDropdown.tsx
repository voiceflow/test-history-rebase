import { Nullable } from '@voiceflow/common';
import { Box, IconButton, IconButtonVariant, NestedMenuComponents } from '@voiceflow/ui';
import React from 'react';

import IntentSelect from '@/components/IntentSelect';
import { ModalType } from '@/constants';
import * as Intent from '@/ducks/intent';
import { useDispatch, useModals } from '@/hooks';

const IntentSelectDropdown: React.FC = () => {
  const { open: openCreateIntentModal, close: closeCreateIntentModal } = useModals(ModalType.INTENT_CREATE);
  const createIntent = useDispatch(Intent.createIntent);

  const createNewIntent = async () => {
    closeCreateIntentModal();

    const nextIntentID = await createIntent();
    openCreateIntentModal({ id: nextIntentID });
  };

  const switchIntent = (value: { intent: Nullable<string> }) => {
    const intentID = value?.intent;
    closeCreateIntentModal();
    openCreateIntentModal({ id: intentID });
  };

  return (
    <>
      <IntentSelect
        minMenuWidth={250}
        noBuiltIns
        optionsMaxSize={7.5}
        inDropdownSearch
        isDropdown
        minWidth={false}
        placement="left-start"
        renderSearchSuffix={() => <IconButton size={16} icon="plus" variant={IconButtonVariant.BASIC} onClick={createNewIntent} />}
        alwaysShowCreate
        creatable={false}
        onChange={switchIntent}
        createInputPlaceholder="Intents"
        footerAction={(hideMenu) => (
          <NestedMenuComponents.FooterActionContainer
            onClick={() => {
              hideMenu();
              // TODO Open NLU manager
            }}
          >
            Open NLU Manager
          </NestedMenuComponents.FooterActionContainer>
        )}
        triggerRenderer={({ onOpenMenu, onHideMenu, isOpen }) => (
          <Box onClick={isOpen ? onHideMenu : onOpenMenu} display="flex" mr={18}>
            <IconButton size={16} activeClick={isOpen} icon="sandwichMenu" variant={IconButtonVariant.BASIC} />
          </Box>
        )}
      />
    </>
  );
};

export default IntentSelectDropdown;
