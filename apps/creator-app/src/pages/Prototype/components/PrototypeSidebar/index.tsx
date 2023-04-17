import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Flex, SvgIcon, TippyTooltip, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import Drawer from '@/components/Drawer';
import { SectionVariant, UncontrolledSection as Section } from '@/components/Section';
import SoundToggle from '@/components/SoundToggle';
import { Permission } from '@/constants/permissions';
import { PrototypeStatus } from '@/constants/prototype';
import * as PrototypeDuck from '@/ducks/prototype';
import { useDispatch, useEventualEngine, usePermission, useTheme } from '@/hooks';
import { useToggle } from '@/hooks/toggle';
import { TrainingModelContext } from '@/pages/Project/contexts';
import Prototype from '@/pages/Prototype';
import { PrototypeContext } from '@/pages/Prototype/context';
import { useDebug, useResetPrototype } from '@/pages/Prototype/hooks';
import { ModelDiff } from '@/utils/prototypeModel';

import { Container, EmbedContainer, TrainingSection } from './components';

export interface TrainingState {
  diff: ModelDiff;
  trainedModel: BaseModels.PrototypeModel | null;
  fetching: boolean;
  lastTrainedTime: number;
}

const PrototypeSidebar: React.FC = () => {
  const theme = useTheme();
  const debugEnabled = useDebug();
  const [canRenderPrototype] = usePermission(Permission.RENDER_PROTOTYPE);
  const prototypeAPI = React.useContext(PrototypeContext);
  const trainingModelAPI = React.useContext(TrainingModelContext);
  const compilePrototype = useDispatch(PrototypeDuck.compilePrototype);
  const { state, actions, config } = prototypeAPI;
  const { locales, projectType, isMuted } = config;
  const { status } = state;
  const { updatePrototype } = actions;

  const { isTraining: isModelTraining, isTrained } = trainingModelAPI;

  const canSeeSoundToggle = Realtime.Utils.typeGuards.isVoiceProjectType(projectType);
  const [trainingOpen, toggleTrainingOpen] = useToggle(false);

  const resetPrototype = useResetPrototype();
  const getEngine = useEventualEngine();
  const [atTop, setAtTop] = React.useState(true);
  const notStarted = status === PrototypeStatus.IDLE;

  const renderPromise = React.useMemo<Promise<void>>(async () => {
    if (canRenderPrototype) {
      await compilePrototype();
    }
  }, []);

  const closeTraining = () => {
    if (trainingOpen) {
      toggleTrainingOpen();
    }
  };

  const openTraining = () => {
    if (!trainingOpen) {
      toggleTrainingOpen();
    }
  };

  useDidUpdateEffect(() => {
    if (status === PrototypeStatus.ACTIVE) {
      closeTraining();
    }
  }, [status]);

  React.useEffect(() => {
    // Reset the custom styling of the header when reset
    if (status === PrototypeStatus.IDLE) {
      setAtTop(true);
    }
  }, [status]);

  React.useEffect(() => {
    // TODO: properly handle error case
    renderPromise.then(() => trainingModelAPI.getDiff()).catch(() => resetPrototype());

    if (Realtime.Utils.typeGuards.isChatProjectType(projectType)) {
      updatePrototype({ muted: true });
    }

    // resetting focus asynchronously to fix line desync issue which is caused due to shifting canvas position to the subheader height
    requestAnimationFrame(() => {
      getEngine()?.focus.reset();
    });
  }, []);

  React.useEffect(() => {
    if (!isTrained) {
      openTraining();
    }
  }, [isTrained]);

  return (
    <Drawer open width={theme.components.prototypeSidebar.width} direction={Drawer.Direction.LEFT}>
      <Container>
        {canRenderPrototype && <TrainingSection isOpen={trainingOpen} onOpen={openTraining} toggleOpen={toggleTrainingOpen} />}

        <Section
          header="DIALOG"
          variant={SectionVariant.PROTOTYPE}
          isRounded={canRenderPrototype}
          suffix={
            <Flex>
              {canSeeSoundToggle && (
                <Box display="inline-block" mr={4}>
                  <SoundToggle projectType={projectType} isMuted={isMuted} onClick={() => updatePrototype({ muted: !isMuted })} />
                </Box>
              )}

              <Box display="inline-block">
                <TippyTooltip content="Reset Test">
                  <SvgIcon
                    icon="randomLoop"
                    color={notStarted ? '#BECEDC' : undefined}
                    clickable={!notStarted}
                    onClick={() => (notStarted ? null : resetPrototype())}
                  />
                </TippyTooltip>
              </Box>
            </Flex>
          }
        />

        <EmbedContainer>
          <Prototype
            config={config}
            state={state}
            actions={actions}
            debug={debugEnabled}
            atTop={atTop}
            setAtTop={setAtTop}
            isModelTraining={isModelTraining}
            renderingPromise={renderPromise}
            locale={locales[0]}
          />
        </EmbedContainer>
      </Container>
    </Drawer>
  );
};

export default PrototypeSidebar;
