import { Box, ButtonVariant, SvgIcon, toast, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import { PageProgress } from '@/components/PageProgressBar/utils';
import { PageProgressBar } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import { useConfirmModal } from '@/ModalsV2/hooks';
import { NLUManagerContext } from '@/pages/NLUManager/context';
import { TrainingModelContext } from '@/pages/Project/contexts';

import { Container, TrainButton, TrashButton } from '../../styles';
import NLUSearch from '../Search';

const EntitiesHeader: React.FC = () => {
  const nluManager = React.useContext(NLUManagerContext);
  const { startTraining, isTraining, isTrained } = React.useContext(TrainingModelContext);

  const handleTrain = () => {
    if (!isTraining) {
      startTraining(Tracking.AssistantOriginType.NLU_MANAGER);
      PageProgress.start(PageProgressBar.NLU_MODEL_TRAINNING, { timeout: 50000 });
    }
  };

  const confirmModal = useConfirmModal();

  const confirmDelete = () => {
    confirmModal.open({
      header: 'Delete Items',
      confirm: () => nluManager.deleteEntities(),
      confirmButtonText: 'Delete',

      body: (
        <>
          Are you sure you want to delete {nluManager.selectedEntityIDs.size} item(s)?
          <br />
          This action cannot be undone.
        </>
      ),
    });
  };

  useDidUpdateEffect(() => {
    if (isTrained) {
      toast.success('Successfully trained model');
      PageProgress.stop(PageProgressBar.NLU_MODEL_TRAINNING);
    }
  }, [isTrained]);

  return (
    <Container style={{ position: 'relative' }}>
      <NLUSearch
        value={nluManager.search}
        placeholder={`Search ${nluManager.entities.length} ${nluManager.entities.length === 1 ? 'entity' : 'entities'}`}
        onChange={nluManager.setSearch}
      />

      <Box.FlexCenter pr={12} gap={10}>
        {!!nluManager.selectedEntityIDs.size && (
          <TrashButton variant={ButtonVariant.SECONDARY} onClick={confirmDelete} icon="trash" iconProps={{ size: 15 }} />
        )}

        <TrainButton active={isTraining} onClick={handleTrain} variant={ButtonVariant.PRIMARY}>
          <Box display="inline-block" position="relative" top={2}>
            <SvgIcon icon="arrowSpin" spin={isTraining} size={16} inline mr={16} />
          </Box>
          Train
        </TrainButton>
      </Box.FlexCenter>
    </Container>
  );
};

export default EntitiesHeader;
