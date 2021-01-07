import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import { FlexCenter } from '@/components/Flex';
import Text, { Link } from '@/components/Text';
import TippyTooltip from '@/components/TippyTooltip';
import { FeatureFlag } from '@/config/features';
import * as Prototype from '@/ducks/prototype';
import { connect } from '@/hocs';
import { useFeature, useTrackingEvents } from '@/hooks';
import PrototypeContainer from '@/pages/Prototype/components/PrototypeContainer';
import { FadeDownContainer } from '@/styles/animations';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import { Container, ContainerV2 } from './components';

const PROTOTYPING_HELP_LINK = 'https://docs.voiceflow.com/#/platform/prototyping';

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
  const generalPrototype = useFeature(FeatureFlag.GENERAL_PROTOTYPE);
  const [, trackEventsWrapper] = useTrackingEvents();
  const start = React.useCallback(() => {
    if (isPublic) {
      onStart();
    } else {
      trackEventsWrapper(onStart, 'trackActiveProjectPrototypeTestStart', { debug, mode, display: device })();
    }
  }, []);

  return (
    <PrototypeContainer id={Identifier.PROTOTYPE} isPublic={isPublic}>
      <FadeDownContainer style={{ height: '100%' }}>
        {generalPrototype.isEnabled ? (
          <ContainerV2>
            <img src="/Testing.svg" alt="user" width="80" />

            <Text fontSize={16} color="#132144" fontWeight={600} mt={16}>
              Test your project.
            </Text>

            <Text fontSize={13} color="#62778c" fontWeight={500} mt={16} mb={27} lineHeight={1.54}>
              Start a test to interact with your project using text, voice or chips. <Link href={PROTOTYPING_HELP_LINK}>Learn more.</Link>
            </Text>

            {isModelTraining ? (
              <TippyTooltip
                trigger="mouseenter"
                html={
                  <div style={{ textAlign: 'left', width: '179px', height: '36px' }}>Once training is complete you'll be able to start a test</div>
                }
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
          </ContainerV2>
        ) : (
          <>
            <Container>
              <img src="/Testing.svg" alt="user" width="80" />

              <div>Start test to see the dialog transcription</div>

              <Button icon="rocket" onClick={start} id={Identifier.PROTOTYPE_START}>
                Start Prototype
              </Button>
            </Container>

            <FlexCenter style={{ paddingBottom: '30px', color: '#62778c', background: '#fdfdfd' }}>
              New to prototyping?
              <Link href={PROTOTYPING_HELP_LINK} style={{ marginLeft: '6px' }}>
                Learn More
              </Link>
            </FlexCenter>
          </>
        )}
      </FadeDownContainer>
    </PrototypeContainer>
  );
};

const mapStateToProps = {
  mode: Prototype.prototypeModeSelector,
  device: Prototype.prototypeVisualDeviceSelector,
};

type ConnectedPrototypeStartProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(PrototypeStart) as React.FC<PrototypeStartProps>;
