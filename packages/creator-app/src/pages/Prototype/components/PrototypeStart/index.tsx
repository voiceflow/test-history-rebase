import { Button, ButtonVariant, Link, Text, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { testingGraphic } from '@/assets';
import * as Documentation from '@/config/documentation';
import * as Prototype from '@/ducks/prototype';
import { PrototypeConfig } from '@/ducks/recent';
import { connect } from '@/hocs';
import { useSetup, useTrackingEvents } from '@/hooks';
import PrototypeContainer from '@/pages/Prototype/components/PrototypeContainer';
import perf, { PerfAction } from '@/performance';
import { FadeDownContainer } from '@/styles/animations';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import { Container } from './components';

export interface PrototypeStartProps {
  debug: boolean;
  config: PrototypeConfig;
  onStart: () => void;
  isPublic?: boolean;
  isModelTraining?: boolean;
}

const PrototypeStart: React.FC<PrototypeStartProps & ConnectedPrototypeStartProps> = ({
  isPublic,
  onStart,
  debug,
  mode,
  device,
  isModelTraining,
  config,
}) => {
  const [, trackEventsWrapper] = useTrackingEvents();

  const start = () => {
    if (isPublic) {
      onStart();
    } else {
      trackEventsWrapper(onStart, 'trackActiveProjectPrototypeTestStart', { debug, mode, display: device, config })();
    }
  };

  useSetup(() => {
    perf.action(PerfAction.PROTOTYPE_START_RENDERED);
  });

  return (
    <PrototypeContainer id={Identifier.PROTOTYPE} isPublic={isPublic}>
      <FadeDownContainer style={{ height: '100%' }}>
        <Container>
          <img src={testingGraphic} alt="user" width="80" />

          <Text fontSize={16} color="#132144" fontWeight={600} mt={16}>
            Run your project
          </Text>

          <Text fontSize={13} color="#62778c" fontWeight={500} mt={16} mb={16} lineHeight={1.54}>
            Run your project to interact with it using text, voice or buttons. <Link href={Documentation.PROTOTYPING}>See more.</Link>
          </Text>

          {isModelTraining ? (
            <TippyTooltip
              trigger="mouseenter"
              html={<div style={{ textAlign: 'left', width: '179px', height: '36px' }}>Once training is complete you'll be able to start a test</div>}
              position="bottom"
            >
              <Button variant={ButtonVariant.TERTIARY} onClick={start} disabled>
                Run Test
              </Button>
            </TippyTooltip>
          ) : (
            <Button variant={ButtonVariant.TERTIARY} onClick={start} id={Identifier.PROTOTYPE_START}>
              Run Test
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
