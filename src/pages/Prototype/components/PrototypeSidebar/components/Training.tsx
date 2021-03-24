import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import Text, { Link } from '@/components/Text';

import NLUContainer from './NLUContainer';
import TrainingLoader from './TrainingLoader';

export type TrainingProps = {
  onCancelTraining: () => void;
};

const Training: React.FC<TrainingProps> = ({ onCancelTraining }) => (
  <NLUContainer containsLoader>
    <TrainingLoader />

    <Text fontSize={13} color="#8da2b5" fontWeight={500} my={16} lineHeight="18px">
      This may take a few minutes.{' '}
      <Link href="https://docs.voiceflow.com/#/platform/testing/testing?id=train-the-voiceflow-assistant">Learn more.</Link>
    </Text>

    <Button variant={ButtonVariant.TERTIARY} onClick={onCancelTraining}>
      Cancel
    </Button>
  </NLUContainer>
);
export default Training;
