import { Box, ButtonVariant, SvgIcon, toast, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import { ConfirmProps } from '@/components/ConfirmModal';
import { PageProgress } from '@/components/PageProgressBar/utils';
import { InteractionModelTabType, ModalType, PageProgressBar } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import { useHotKeys, useModals } from '@/hooks';
import { Hotkey } from '@/keymap';
import { NLUManagerContext } from '@/pages/NLUManager/context';
import { TrainingModelContext } from '@/pages/Project/contexts';

import { Container, SearchInput, TrainButton, TrashButton } from './components';
import Export from './components/Export';

const getSearchPlaceholder = {
  [InteractionModelTabType.SLOTS]: (length: number) => (length === 1 ? 'entity' : 'entities'),
  [InteractionModelTabType.INTENTS]: (length: number) => (length === 1 ? 'intent' : 'intents'),
  [InteractionModelTabType.VARIABLES]: (length: number) => (length === 1 ? 'variable' : 'variables'),
};

const ContentHeader: React.FC = () => {
  const nluManager = React.useContext(NLUManagerContext);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const { startTraining, isTraining, isTrained } = React.useContext(TrainingModelContext);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleTrain = () => {
    if (!isTraining) {
      startTraining(Tracking.AssistantOriginType.NLU_MANAGER);
      PageProgress.start(PageProgressBar.NLU_MODEL_TRAINNING, 50000);
    }
  };

  useHotKeys(Hotkey.FOCUS_NLU_MANAGER_SEARCH, focusInput, { action: 'keyup' });

  const confirmModal = useModals<ConfirmProps>(ModalType.CONFIRM);

  const confirmDelete = () => {
    confirmModal.open({
      body: (
        <>
          Are you sure you want to delete {nluManager.selectedItemIDs.size} item(s)?
          <br />
          This action cannot be undone.
        </>
      ),
      header: 'Delete Items',
      confirm: () => nluManager.deleteSelectedItems(),
      confirmButtonText: 'Delete',
    });
  };

  useDidUpdateEffect(() => {
    if (isTrained) {
      toast.success('Successfully trained model');
      PageProgress.stop(PageProgressBar.NLU_MODEL_TRAINNING);
    }
  }, [isTrained]);

  return (
    <Container>
      <Box>
        <SearchInput
          ref={inputRef}
          icon="search"
          value={nluManager.search}
          iconProps={{ color: '#8da2b5', size: 16 }}
          placeholder={`Search ${nluManager.items.length} ${getSearchPlaceholder[nluManager.activeTab](nluManager.items.length)}`}
          onChangeText={nluManager.setSearch}
        />
      </Box>

      <Box.FlexCenter pr={12} gap={10}>
        {!!nluManager.selectedItemIDs.size && (
          <TrashButton variant={ButtonVariant.SECONDARY} flat squareRadius onClick={confirmDelete}>
            <SvgIcon icon="trash" size={15} inline />
          </TrashButton>
        )}

        <Export checkedItems={Array.from(nluManager.selectedItemIDs)} activeTab={nluManager.activeTab} />

        <TrainButton active={isTraining} onClick={handleTrain} squareRadius variant={ButtonVariant.PRIMARY}>
          <Box display="inline-block" position="relative" top={2}>
            <SvgIcon icon="arrowSpin" spin={isTraining} size={16} inline mr={16} />
          </Box>
          Train
        </TrainButton>
      </Box.FlexCenter>
    </Container>
  );
};

export default ContentHeader;
