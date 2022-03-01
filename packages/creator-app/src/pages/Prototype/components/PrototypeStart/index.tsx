import { Button, ButtonVariant, Link, Text, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { testingGraphic } from '@/assets';
import * as Documentation from '@/config/documentation';
import { FeatureFlag } from '@/config/features';
import * as Prototype from '@/ducks/prototype';
import { PrototypeConfig } from '@/ducks/recent';
import { useFeature, useSelector, useSetup, useTrackingEvents } from '@/hooks';
import { IdleContainer } from '@/pages/Prototype/components/PrototypeContainer';
import perf, { PerfAction } from '@/performance';
import { FadeDownContainer } from '@/styles/animations';
import { Identifier } from '@/styles/constants';

import { Container, SelectedVariableStateText, SelectVariableStateButton } from './components';

export interface PrototypeStartProps {
  debug: boolean;
  config: Omit<PrototypeConfig, 'platform'>;
  onStart: () => void;
  isPublic?: boolean;
  isModelTraining?: boolean;
}

const PrototypeStart: React.FC<PrototypeStartProps> = ({ isPublic, onStart, debug, isModelTraining, config }) => {
  const mode = useSelector(Prototype.activePrototypeModeSelector);
  const device = useSelector(Prototype.prototypeVisualDeviceSelector);
  const [, trackEventsWrapper] = useTrackingEvents();
  const { isEnabled: isVariableStateEnabled } = useFeature(FeatureFlag.VARIABLE_STATES);

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
    <IdleContainer id={Identifier.PROTOTYPE} isPublic={isPublic}>
      <FadeDownContainer style={{ height: '100%' }}>
        <Container>
          <img src={testingGraphic} alt="user" width="80" />

          <Text fontSize={16} color="#132144" fontWeight={600} mt={16}>
            Run your project
          </Text>

          <Text fontSize={13} color="#62778c" mt={8} mb={24} lineHeight={1.54}>
            Start a test to interact with your project using text, voice or buttons. <Link href={Documentation.PROTOTYPING}>See more.</Link>
          </Text>

          {isModelTraining ? (
            <TippyTooltip
              trigger="mouseenter"
              html={<div style={{ textAlign: 'left', width: '179px', height: '36px' }}>Once training is complete you'll be able to start a test</div>}
              position="bottom"
            >
              {isVariableStateEnabled ? (
                <SelectVariableStateButton onStart={start} />
              ) : (
                <Button variant={ButtonVariant.PRIMARY} squareRadius onClick={start} disabled>
                  Run Test
                </Button>
              )}
            </TippyTooltip>
          ) : (
            <>
              {isVariableStateEnabled ? (
                <SelectVariableStateButton onStart={start} />
              ) : (
                <Button variant={ButtonVariant.PRIMARY} onClick={start} squareRadius id={Identifier.PROTOTYPE_START}>
                  Run Test
                </Button>
              )}
            </>
          )}

          <SelectedVariableStateText />
        </Container>
      </FadeDownContainer>
    </IdleContainer>
  );
};

export default PrototypeStart;
