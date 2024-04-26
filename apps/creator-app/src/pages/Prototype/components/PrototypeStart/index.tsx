import { Animations, Link, Text, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { testingGraphic } from '@/assets';
import * as Documentation from '@/config/documentation';
import * as Prototype from '@/ducks/prototype';
import type { PrototypeConfig } from '@/ducks/recent';
import { useSelector, useTrackingEvents } from '@/hooks';
import { IdleContainer } from '@/pages/Prototype/components/PrototypeContainer';
import { Identifier } from '@/styles/constants';

import SelectedVariableStateText from './SelectedVariableStateText';
import SelectVariableStateButton from './SelectVariableStateButton';
import * as S from './styles';

export interface PrototypeStartProps {
  debug: boolean;
  config: Omit<PrototypeConfig, 'platform'>;
  onStart: () => void;
  isPublic?: boolean;
  isModelTraining?: boolean;
}

const PrototypeStart: React.FC<PrototypeStartProps> = ({ isPublic, onStart, debug, isModelTraining, config }) => {
  const device = useSelector(Prototype.prototypeVisualDeviceSelector);
  const [, trackEventsWrapper] = useTrackingEvents();

  const start = () => {
    if (isPublic) {
      onStart();
    } else {
      trackEventsWrapper(onStart, 'trackActiveProjectPrototypeTestStart', { debug, display: device, config })();
    }
  };

  return (
    <IdleContainer id={Identifier.PROTOTYPE} isPublic={isPublic}>
      <Animations.FadeDown style={{ height: '100%' }}>
        <S.Container>
          <img src={testingGraphic} alt="user" width="80" />

          <Text fontSize={16} color="#132144" fontWeight={600} mt={16}>
            Run your assistant
          </Text>

          <Text fontSize={13} color="#62778c" mt={8} mb={16} lineHeight={1.54}>
            Start a test to interact with your assistant using text, voice or buttons.{' '}
            <Link href={Documentation.TEST_TOOL}>See more.</Link>
          </Text>

          {isModelTraining ? (
            <TippyTooltip
              trigger="mouseenter"
              content={
                <div style={{ textAlign: 'left', width: '179px', height: '36px' }}>
                  Once training is complete you'll be able to start a test
                </div>
              }
              position="bottom"
            >
              <SelectVariableStateButton onStart={start} />
            </TippyTooltip>
          ) : (
            <SelectVariableStateButton onStart={start} />
          )}

          <SelectedVariableStateText />
        </S.Container>
      </Animations.FadeDown>
    </IdleContainer>
  );
};

export default PrototypeStart;
