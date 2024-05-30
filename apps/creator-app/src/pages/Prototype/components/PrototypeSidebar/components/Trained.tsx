import * as Platform from '@voiceflow/platform-config';
import { Box, Button, ButtonVariant, System, Text } from '@voiceflow/ui';
import React from 'react';

import { lightbulbGraphic } from '@/assets';
import * as Documentation from '@/config/documentation';
import { createPlatformSelector } from '@/utils/platform';

import ModelState from './ModelState';
import NLUContainer from './NLUContainer';

const getTrainText = createPlatformSelector(
  {
    [Platform.Constants.PlatformType.ALEXA]: 'Train Alexa Skill',
    [Platform.Constants.PlatformType.GOOGLE]: 'Train Google Action',
  },
  'Train Agent'
);

interface TrainedProps {
  platform: Platform.Constants.PlatformType;
  isTrained?: boolean;
  onStartTraining: () => void;
  nluTrainingDiffData: {
    trainedCount: number;
    untrainedCount: number;
    lastTrainedTime: number | null;
    trainedSlotsCount: number;
    trainedIntentsCount: number;
    untrainedSlotsCount: number;
    untrainedIntentsCount: number;
  };
}

const Trained: React.FC<TrainedProps> = ({ platform, isTrained, nluTrainingDiffData, onStartTraining }) => {
  return (
    <NLUContainer fullWidth>
      {nluTrainingDiffData.trainedCount === 0 ? (
        <>
          <img src={lightbulbGraphic} alt="user" width="80" />

          <Text fontSize={16} color="#132144" fontWeight={600} mt={16}>
            Your agent needs training
          </Text>

          <Text fontSize={13} color="#62778c" mt={8} mb={16} lineHeight={1.54}>
            Train your agent for the highest fidelity testing experience.{' '}
            <System.Link.Anchor href={Documentation.ASSISTANT_TRAINING}>Learn more.</System.Link.Anchor>
          </Text>
        </>
      ) : (
        <>
          <Box width="100%" pr={20} pl={10}>
            <ModelState nluTrainingDiffData={nluTrainingDiffData} />
          </Box>

          <Text fontSize={13} color="#62778c" mt={20} mb={16} lineHeight={1.54}>
            {isTrained ? 'Agent is trained and ready for testing.' : 'Agent model has changed. We highly recommend training your agent.'}
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
