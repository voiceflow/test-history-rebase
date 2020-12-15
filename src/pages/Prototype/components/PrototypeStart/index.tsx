import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import Text, { Link } from '@/components/Text';
import { FeatureFlag } from '@/config/features';
import { useFeature } from '@/hooks';

import { Container, ContainerV2 } from './components';

export type PrototypeStartProps = {
  start: React.MouseEventHandler<HTMLButtonElement>;
};

const PrototypeStart: React.FC<PrototypeStartProps> = ({ start }) => {
  const generalPrototype = useFeature(FeatureFlag.GENERAL_PROTOTYPE);
  return generalPrototype.isEnabled ? (
    <ContainerV2>
      <img src="/Testing.svg" alt="user" width="80" />

      <Text fontSize={16} color="#132144" fontWeight={600} mt={16}>
        Test your project.
      </Text>
      <Text fontSize={13} color="#62778c" fontWeight={500} mt={16} mb={27} lineHeight={1.54}>
        Start a test to interact with your project using text, voice or chips.{' '}
        <Link href="https://docs.voiceflow.com/#/platform/prototyping">Learn more.</Link>
      </Text>

      <Button variant={ButtonVariant.TERTIARY} onClick={start}>
        Start Test
      </Button>
    </ContainerV2>
  ) : (
    <Container>
      <img src="/Testing.svg" alt="user" width="80" />

      <div>Start test to see the dialog transcription</div>

      <Button icon="rocket" onClick={start}>
        Start Prototype
      </Button>
    </Container>
  );
};

export default PrototypeStart;
