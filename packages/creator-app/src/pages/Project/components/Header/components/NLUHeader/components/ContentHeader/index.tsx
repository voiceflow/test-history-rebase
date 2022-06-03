import { Box, Button, ButtonVariant, SvgIcon, toast, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import { ConfirmProps } from '@/components/ConfirmModal';
import { InteractionModelTabType, ModalType } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';
import * as SlotV2 from '@/ducks/slotV2';
import { useHotKeys, useModals, useSelector } from '@/hooks';
import { Hotkey } from '@/keymap';
import { useOrderedVariables } from '@/pages/Canvas/components/NLUQuickView/hooks';
import { NLUManagerContext } from '@/pages/NLUManager/context';
import { TrainingModelContext } from '@/pages/Project/contexts';

import { Container, SearchInput, TrainButton, TrashButton } from './components';

const getSearchPlaceholder = {
  [InteractionModelTabType.INTENTS]: (length: number) => (length === 1 ? 'intent' : 'intents'),
  [InteractionModelTabType.SLOTS]: (length: number) => (length === 1 ? 'entity' : 'entities'),
  [InteractionModelTabType.VARIABLES]: (length: number) => (length === 1 ? 'variable' : 'variables'),
};

const ContentHeader: React.FC = () => {
  const { search, setSearch, activeTab, checkedItems, handleItemsDelete } = React.useContext(NLUManagerContext);
  const allIntents = useSelector(IntentV2.allCustomIntentsSelector);
  const allSlots = useSelector(SlotV2.allSlotsSelector);
  const { mergedVariables } = useOrderedVariables();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const canExport = activeTab === InteractionModelTabType.INTENTS;
  const { startTraining, isTraining, isTrained } = React.useContext(TrainingModelContext);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleTrain = () => {
    if (!isTraining) {
      startTraining();
    }
  };

  useHotKeys(Hotkey.FOCUS_NLU_MANAGER_SEARCH, focusInput, { action: 'keyup' });

  const itemCount = () => {
    const itemCounts = {
      [InteractionModelTabType.INTENTS]: allIntents.length,
      [InteractionModelTabType.SLOTS]: allSlots.length,
      [InteractionModelTabType.VARIABLES]: mergedVariables.length,
    };
    return itemCounts[activeTab];
  };

  const { open: openConfirmModal } = useModals<ConfirmProps>(ModalType.CONFIRM);

  const confirmDelete = () => {
    openConfirmModal({
      header: 'Delete Items',
      canCancel: true,
      confirmButtonText: 'Delete',
      body: (
        <div>
          Are you sure you want to delete {checkedItems.length} item(s)?
          <br />
          <div>This action cannot be undone.</div>
        </div>
      ),
      confirm: () => {
        handleItemsDelete();
      },
    });
  };

  useDidUpdateEffect(() => {
    if (isTrained) {
      toast.success('Successfully trained model');
    }
  }, [isTrained]);

  return (
    <Container>
      <Box>
        <SearchInput
          ref={inputRef}
          iconProps={{ color: '#8da2b5', size: 16 }}
          onChangeText={setSearch}
          value={search}
          icon="search"
          placeholder={`Search ${itemCount()} ${getSearchPlaceholder[activeTab](itemCount())}`}
        />
      </Box>
      <Box>
        {!!checkedItems.length && (
          <TrashButton variant={ButtonVariant.SECONDARY} flat squareRadius onClick={confirmDelete}>
            <SvgIcon icon="trash" size={15} inline />
          </TrashButton>
        )}
        {canExport && (
          <Box display="inline-block" mr={10}>
            <Button squareRadius variant={ButtonVariant.SECONDARY} disabled={!checkedItems.length} flat>
              Export
              {!!checkedItems.length && ` (${checkedItems.length})`}
            </Button>
          </Box>
        )}
        <Box display="inline-block" mr={16}>
          <TrainButton active={isTraining} onClick={handleTrain} squareRadius variant={ButtonVariant.PRIMARY}>
            <Box display="inline-block" position="relative" top={2}>
              <SvgIcon icon="publishSpin" spin={isTraining} size={16} inline mr={16} />
            </Box>
            Train
          </TrainButton>
        </Box>
      </Box>
    </Container>
  );
};

export default ContentHeader;
