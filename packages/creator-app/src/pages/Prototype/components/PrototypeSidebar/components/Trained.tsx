import { BaseModels } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import { Box, Button, ButtonVariant, Link, Text } from '@voiceflow/ui';
import React from 'react';

import { lightbulbGraphic } from '@/assets';
import * as Documentation from '@/config/documentation';
import { createPlatformSelector } from '@/utils/platform';
import { ModelDiff } from '@/utils/prototypeModel';

import ModelState from './ModelState';
import NLUContainer from './NLUContainer';

const getTrainText = createPlatformSelector(
  {
    [Platform.Constants.PlatformType.ALEXA]: 'Train Alexa Skill',
    [Platform.Constants.PlatformType.GOOGLE]: 'Train Google Action',
  },
  'Train Assistant'
);

interface TrainedProps {
  diff: ModelDiff;
  platform: Platform.Constants.PlatformType;
  isTrained?: boolean;
  trainedModel: BaseModels.PrototypeModel | null;
  lastTrainedTime: number;
  onStartTraining: () => void;
}

const Trained: React.FC<TrainedProps> = ({ diff, platform, isTrained, trainedModel, lastTrainedTime, onStartTraining }) => {
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

      <Button variant={ButtonVariant.TERTIARY} disabled={isTrained} squareRadius onClick={onStartTraining}>
        {getTrainText(platform)}
      </Button>
    </NLUContainer>
  );
};

export default Trained;
