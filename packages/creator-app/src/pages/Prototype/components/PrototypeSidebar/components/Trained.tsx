import { BaseModels } from '@voiceflow/base-types';
import { Box, Button, ButtonVariant, Link, Text } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { lightbulbGraphic } from '@/assets';
import * as Documentation from '@/config/documentation';
import { FeatureFlag } from '@/config/features';
import { useFeature } from '@/hooks';
import { createPlatformSelector } from '@/utils/platform';
import { ModelDiff } from '@/utils/prototypeModel';

import ModelState from './ModelState';
import NLUContainer from './NLUContainer';

const getTrainText = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: 'Train Alexa Skill',
    [VoiceflowConstants.PlatformType.GOOGLE]: 'Train Google Action',
  },
  'Train Assistant'
);

interface TrainedProps {
  diff: ModelDiff;
  platform: VoiceflowConstants.PlatformType;
  isTrained?: boolean;
  trainedModel: BaseModels.PrototypeModel | null;
  lastTrainedTime: number;
  onStartTraining: () => void;
}

const Trained: React.FC<TrainedProps> = ({ diff, platform, isTrained, trainedModel, lastTrainedTime, onStartTraining }) => {
  const { isEnabled: isVariableStateEnabled } = useFeature(FeatureFlag.VARIABLE_STATES);

  return (
    <NLUContainer fullWidth>
      {trainedModel === null ? (
        <>
          <img src={lightbulbGraphic} alt="user" width="80" />

          <Text fontSize={16} color="#132144" fontWeight={600} mt={16}>
            Your assistant needs training
          </Text>

          <Text fontSize={13} color="#62778c" mt={8} mb={16} lineHeight={1.54}>
            Train your assistant for the highest fidelity testing experience. <Link href={Documentation.ASSISTANT_TRAINING}>Learn more.</Link>
          </Text>
        </>
      ) : (
        <>
          <Box width="100%" pr={20} pl={10}>
            <ModelState diff={diff} trainedModel={trainedModel} lastTrainedTime={lastTrainedTime} />
          </Box>

          <Text fontSize={13} color="#62778c" mt={20} mb={16} lineHeight={1.54}>
            {isTrained ? 'Assistant is trained and ready for testing.' : 'Assistant model has changed. We highly recommend training your assistant.'}
          </Text>
        </>
      )}

      <Button variant={ButtonVariant.TERTIARY} disabled={isTrained} squareRadius={isVariableStateEnabled || undefined} onClick={onStartTraining}>
        {getTrainText(platform)}
      </Button>
    </NLUContainer>
  );
};

export default Trained;
