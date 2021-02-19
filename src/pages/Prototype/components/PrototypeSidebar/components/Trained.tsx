import { PrototypeModel } from '@voiceflow/api-sdk';
import React from 'react';

import Box from '@/components/Box';
import Button, { ButtonVariant } from '@/components/Button';
import Text, { Link } from '@/components/Text';
import { PlatformType } from '@/constants';
import { ModelDiff } from '@/utils/prototypeModel';

import ModelState from './ModelState';
import NLUContainer from './NLUContainer';

const TRAIN_ASSISTANT_TEXT = {
  [PlatformType.ALEXA]: 'Train Alexa Skill',
  [PlatformType.GOOGLE]: 'Train Google Action',
  [PlatformType.GENERAL]: 'Train Assistant',
};

type TrainedProps = {
  diff: ModelDiff;
  platform: PlatformType;
  isTrained?: boolean;
  trainedModel: PrototypeModel | null;
  lastTrainedTime: number;
  onStartTraining: () => void;
};

const Trained: React.FC<TrainedProps> = ({ diff, platform, isTrained, trainedModel, lastTrainedTime, onStartTraining }) => (
  <NLUContainer fullWidth>
    {trainedModel === null ? (
      <>
        <img src="/lightbulb.svg" alt="user" width="80" />

        <Text fontSize={16} color="#132144" fontWeight={600} mt={16}>
          Your assistant needs training
        </Text>

        <Text fontSize={13} color="#62778c" fontWeight={500} mt={16} mb={27} lineHeight={1.54}>
          Train your assistant for the highest fidelity testing experience.{' '}
          <Link href="https://docs.voiceflow.com/quickstart/testing?id=assistant-training">Learn more.</Link>
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

    <Button variant={ButtonVariant.TERTIARY} disabled={isTrained} onClick={onStartTraining}>
      {TRAIN_ASSISTANT_TEXT[platform]}
    </Button>
  </NLUContainer>
);

export default Trained;
