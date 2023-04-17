import { Button, ButtonVariant, Link, Text } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';

import NLUContainer from './NLUContainer';
import TrainingLoader from './TrainingLoader';

export interface TrainingProps {
  onCancelTraining: () => void;
}

const Training: React.FC<TrainingProps> = ({ onCancelTraining }) => {
  return (
    <NLUContainer containsLoader>
      <TrainingLoader />

      <Text fontSize={13} color="#8da2b5" fontWeight={500} my={16} lineHeight="18px">
        This may take a few minutes. <Link href={Documentation.ASSISTANT_TRAINING}>Learn more.</Link>
      </Text>

      <Button variant={ButtonVariant.TERTIARY} squareRadius onClick={onCancelTraining}>
        Cancel
      </Button>
    </NLUContainer>
  );
};
export default Training;
