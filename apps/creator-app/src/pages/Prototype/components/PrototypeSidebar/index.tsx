import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Flex, SvgIcon, TippyTooltip, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import Drawer from '@/components/Drawer';
import { SectionVariant, UncontrolledSection as Section } from '@/components/Section';
import SoundToggle from '@/components/SoundToggle';
import { Permission } from '@/constants/permissions';
import { PrototypeStatus } from '@/constants/prototype';
import { Designer, UI } from '@/ducks';
import * as PrototypeDuck from '@/ducks/prototype';
import { useDispatch, usePermission, useTheme } from '@/hooks';
import { useEventualEngine } from '@/hooks/engine.hook';
import { useSelector } from '@/hooks/store.hook';
import { useToggle } from '@/hooks/toggle';
import { NLUTrainingModelContext } from '@/pages/Project/contexts';
import Prototype from '@/pages/Prototype';
import { PrototypeContext } from '@/pages/Prototype/context';
import { useDebug, useResetPrototype } from '@/pages/Prototype/hooks';
import { controlledPromiseFactory } from '@/utils/promise.util';

import { Container, EmbedContainer, TrainingSection } from './components';

const PrototypeSidebar: React.FC = () => {
  const theme = useTheme();
  const debugEnabled = useDebug();
  const [canRenderPrototype] = usePermission(Permission.PROJECT_PROTOTYPE_RENDER);
  const prototypeAPI = React.useContext(PrototypeContext);
  const nluTrainingModel = React.useContext(NLUTrainingModelContext);
  const nluTrainingDiffData = useSelector(Designer.Environment.selectors.nluTrainingDiffData);
  const compilePrototype = useDispatch(PrototypeDuck.compilePrototype);
  const isCanvasOnly = useSelector(UI.selectors.isCanvasOnly);
  const { state, actions, config } = prototypeAPI;
  const { locales, projectType, isMuted } = config;
  const { status } = state;
  const { updatePrototype } = actions;

  const canSeeSoundToggle = Realtime.Utils.typeGuards.isVoiceProjectType(projectType);
  const [trainingOpen, toggleTrainingOpen] = useToggle(false);

  const resetPrototype = useResetPrototype();
  const getEngine = useEventualEngine();
  const [atTop, setAtTop] = React.useState(true);
  const notStarted = status === PrototypeStatus.IDLE;

  const renderPromise = React.useMemo(() => controlledPromiseFactory<void>(), []);

  const closeTraining = () => {
    toggleTrainingOpen(false);
  };

  const openTraining = () => {
    toggleTrainingOpen(true);
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
    if (Realtime.Utils.typeGuards.isChatProjectType(projectType)) {
      updatePrototype({ muted: true });
    }

    (async () => {
      try {
        if (canRenderPrototype) {
          await compilePrototype();
        }

        await nluTrainingModel?.calculateDiff();

        renderPromise.resolve();
      } catch {
        resetPrototype();
      }
    })();

    // resetting focus asynchronously to fix line desync issue which is caused due to shifting canvas position to the subheader height
    requestAnimationFrame(() => getEngine()?.focus.reset());

    return () => {
      renderPromise.reject();
    };
  }, [renderPromise]);

  React.useEffect(() => {
    const isUntrained = !nluTrainingModel.isTrained && nluTrainingDiffData.untrainedCount > 0;

    if (nluTrainingModel.isFailed || isUntrained) openTraining();
  }, [nluTrainingModel.isTrained, nluTrainingDiffData.untrainedCount]);

  return (
    <Drawer
      open
      width={theme.components.prototypeSidebar.width}
      direction={Drawer.Direction.LEFT}
      style={{
        top: isCanvasOnly ? 0 : theme.components.header.newHeight,
        height: isCanvasOnly ? '100%' : `calc(100% - ${theme.components.header.newHeight}px)`,
      }}
    >
      <Container>
        {canRenderPrototype && (
          <TrainingSection isOpen={trainingOpen} onOpen={openTraining} toggleOpen={toggleTrainingOpen} />
        )}

        <Section
          header="DIALOG"
          variant={SectionVariant.PROTOTYPE}
          isRounded={canRenderPrototype}
          suffix={
            <Flex>
              {canSeeSoundToggle && (
                <Box display="inline-block" mr={4}>
                  <SoundToggle
                    projectType={projectType}
                    isMuted={isMuted}
                    onClick={() => updatePrototype({ muted: !isMuted })}
                  />
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
            isModelTraining={nluTrainingModel.isTraining}
            renderingPromise={renderPromise}
            locale={locales[0]}
          />
        </EmbedContainer>
      </Container>
    </Drawer>
  );
};

export default PrototypeSidebar;
