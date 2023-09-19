import { Box, ButtonVariant, SvgIcon, useDidUpdateEffect } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import React from 'react';

import { PageProgress } from '@/components/PageProgressBar/utils';
import { PageProgressBar } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import { NLUManagerContext } from '@/pages/NLUManager/context';
import { TrainingModelContext } from '@/pages/Project/contexts';

import { Container, TrainButton } from '../../styles';
import NLUSearch from '../Search';

const IntentsHeader: React.FC = () => {
  const nluManager = React.useContext(NLUManagerContext);

  const { startTraining, isTraining, isTrained } = React.useContext(TrainingModelContext);

  const handleTrain = () => {
    if (!isTraining) {
      startTraining(Tracking.AssistantOriginType.NLU_MANAGER);
      PageProgress.start(PageProgressBar.NLU_MODEL_TRAINNING, { timeout: 50000 });
    }
  };

  useDidUpdateEffect(() => {
    if (isTrained) {
      toast.success('Successfully trained model');
      PageProgress.stop(PageProgressBar.NLU_MODEL_TRAINNING);
    }
  }, [isTrained]);

  return (
    <Container>
      <NLUSearch
        value={nluManager.search}
        placeholder={`Search ${nluManager.intents.length} ${nluManager.intents.length === 1 ? 'intent' : 'intents'}`}
        onChange={nluManager.setSearch}
      />

      <Box.FlexCenter pr={12} gap={10}>
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

export default IntentsHeader;
