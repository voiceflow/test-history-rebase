import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Flex, FlexCenter, LoadCircle, SvgIcon, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';
import { Tooltip } from 'react-tippy';

import Drawer from '@/components/Drawer';
import { SectionVariant, UncontrolledSection as Section } from '@/components/Section';
import SoundToggle from '@/components/SoundToggle';
import { Permission } from '@/config/permissions';
import { PrototypeStatus } from '@/constants/prototype';
import * as Diagram from '@/ducks/diagram';
import * as PrototypeDuck from '@/ducks/prototype';
import { useDispatch, useEventualEngine, usePermission, useTheme } from '@/hooks';
import { useEnableDisable, useToggle } from '@/hooks/toggle';
import { TrainingModelContext } from '@/pages/Project/contexts';
import Prototype from '@/pages/Prototype';
import { PrototypeContext } from '@/pages/Prototype/context';
import { useDebug, useResetPrototype } from '@/pages/Prototype/hooks';
import { PMStatus } from '@/pages/Prototype/types';
import { FadeLeftContainer } from '@/styles/animations';
import { SlideOutDirection } from '@/styles/transitions';
import { ModelDiff } from '@/utils/prototypeModel';
import * as Sentry from '@/vendors/sentry';

import { Container, EmbedContainer, TrainingSection } from './components';

export interface TrainingState {
  diff: ModelDiff;
  trainedModel: BaseModels.PrototypeModel | null;
  fetching: boolean;
  lastTrainedTime: number;
}

export interface PrototypeSidebarProps {
  open: boolean;
}

const PrototypeSidebar: React.FC<PrototypeSidebarProps> = ({ open }) => {
  const theme = useTheme();
  const debugEnabled = useDebug();
  const [canRenderPrototype] = usePermission(Permission.RENDER_PROTOTYPE);
  const prototypeAPI = React.useContext(PrototypeContext);
  const trainingModelAPI = React.useContext(TrainingModelContext);
  const compilePrototype = useDispatch(PrototypeDuck.compilePrototype);
  const saveActiveDiagram = useDispatch(Diagram.saveActiveDiagram);
  const { state, actions, config } = prototypeAPI;
  const { locales, projectType, isMuted } = config;
  const { status } = state;
  const { updatePrototype } = actions;

  const { isTraining: isModelTraining, isTrained } = trainingModelAPI;

  const canSeeSoundToggle = Realtime.Utils.typeGuards.isVoiceProjectType(projectType);
  const [trainingOpen, toggleTrainingOpen] = useToggle(false);
  const [loading, enableLoading, disableLoading] = useEnableDisable(true);
  const resetPrototype = useResetPrototype();
  const getEngine = useEventualEngine();
  const [atTop, setAtTop] = React.useState(true);
  const notStarted = (status as any) === PMStatus.IDLE;

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
    if ((status as any) === PMStatus.IDLE) {
      setAtTop(true);
    }
  }, [status]);

  React.useEffect(() => {
    if (!open) return undefined;

    if (Realtime.Utils.typeGuards.isChatProjectType(projectType)) {
      updatePrototype({ muted: true });
    }

    const renderAbortControl = { aborted: false };

    if (canRenderPrototype) {
      (async () => {
        enableLoading();

        await saveActiveDiagram().catch(Sentry.error);
        await compilePrototype(renderAbortControl);
        await trainingModelAPI.getDiff();

        disableLoading();
      })();
    } else {
      disableLoading();
    }

    // resetting focus asynchronously to fix line desync issue which is caused due to shifting canvas position to the subheader height
    requestAnimationFrame(() => {
      getEngine()?.focus.reset();
    });

    return () => {
      renderAbortControl.aborted = true;

      resetPrototype();
    };
  }, [open]);

  React.useEffect(() => {
    if (!isTrained) {
      openTraining();
    }
  }, [isTrained]);

  return (
    <>
      <Drawer open={open} width={theme.components.prototypeSidebar.width} direction={SlideOutDirection.LEFT}>
        {loading ? (
          <FlexCenter style={{ height: '100%' }}>
            <FadeLeftContainer>
              <LoadCircle />
            </FadeLeftContainer>
          </FlexCenter>
        ) : (
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
                    <Tooltip title="Reset Test">
                      <SvgIcon
                        icon="restart"
                        color={notStarted ? '#BECEDC' : undefined}
                        clickable={!notStarted}
                        onClick={() => (notStarted ? null : resetPrototype())}
                      />
                    </Tooltip>
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
                locale={locales[0]}
              />
            </EmbedContainer>
          </Container>
        )}
      </Drawer>
    </>
  );
};

export default PrototypeSidebar;
