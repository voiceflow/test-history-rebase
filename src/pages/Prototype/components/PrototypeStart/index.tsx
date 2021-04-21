import React from 'react';

import { testingGraphic } from '@/assets';
import Button, { ButtonVariant } from '@/components/Button';
import Text, { Link } from '@/components/Text';
import TippyTooltip from '@/components/TippyTooltip';
import * as Prototype from '@/ducks/prototype';
import { connect } from '@/hocs';
import { useTrackingEvents } from '@/hooks';
import PrototypeContainer from '@/pages/Prototype/components/PrototypeContainer';
import { FadeDownContainer } from '@/styles/animations';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import { Container } from './components';

const PROTOTYPING_HELP_LINK = 'https://docs.voiceflow.com/quickstart/testing';

export type PrototypeStartProps = {
  debug: boolean;
  onStart: () => void;
  isPublic?: boolean;
  isModelTraining?: boolean;
};

const PrototypeStart: React.FC<PrototypeStartProps & ConnectedPrototypeStartProps> = ({
  isPublic,
  onStart,
  debug,
  mode,
  device,
  isModelTraining,
}) => {
  const [, trackEventsWrapper] = useTrackingEvents();

  const start = () => {
    if (isPublic) {
      onStart();
    } else {
      trackEventsWrapper(onStart, 'trackActiveProjectPrototypeTestStart', { debug, mode, display: device })();
    }
  };

  return (
    <PrototypeContainer id={Identifier.PROTOTYPE} isPublic={isPublic}>
      <FadeDownContainer style={{ height: '100%' }}>
        <Container>
          <img src={testingGraphic} alt="user" width="80" />

          <Text fontSize={16} color="#132144" fontWeight={600} mt={16}>
            Test your project
          </Text>

          <Text fontSize={13} color="#62778c" fontWeight={500} mt={16} mb={16} lineHeight={1.54}>
            Start a test to interact with your project using text, voice or chips. <Link href={PROTOTYPING_HELP_LINK}>Learn more.</Link>
          </Text>

          {isModelTraining ? (
            <TippyTooltip
              trigger="mouseenter"
              html={<div style={{ textAlign: 'left', width: '179px', height: '36px' }}>Once training is complete you'll be able to start a test</div>}
              position="bottom"
            >
              <Button variant={ButtonVariant.TERTIARY} onClick={start} disabled>
                Start Test
              </Button>
            </TippyTooltip>
          ) : (
            <Button variant={ButtonVariant.TERTIARY} onClick={start} id={Identifier.PROTOTYPE_START}>
              Start Test
            </Button>
          )}
        </Container>
      </FadeDownContainer>
    </PrototypeContainer>
  );
};

const mapStateToProps = {
  mode: Prototype.activePrototypeModeSelector,
  device: Prototype.prototypeVisualDeviceSelector,
};

type ConnectedPrototypeStartProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(PrototypeStart) as React.FC<PrototypeStartProps>;
