import React from 'react';
import { Tooltip } from 'react-tippy';

import Box from '@/components/Box';
import Drawer from '@/components/Drawer';
import Flex, { FlexCenter } from '@/components/Flex';
import { LoadCircle } from '@/components/Loader';
import { SectionVariant, UncontrolledSection as Section } from '@/components/Section';
import SvgIcon from '@/components/SvgIcon';
import { PlatformType } from '@/constants';
import { NLPTrainStageType } from '@/constants/platforms';
import * as Diagram from '@/ducks/diagram';
import * as PrototypeDuck from '@/ducks/prototype';
import { PrototypeStatus } from '@/ducks/prototype';
import * as Recent from '@/ducks/recent';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useDidUpdateEffect, useEventualEngine, useTheme } from '@/hooks';
import { useEnableDisable, useToggle } from '@/hooks/toggle';
import Prototype from '@/pages/Prototype';
import { useResetPrototype } from '@/pages/Prototype/hooks';
import { PMStatus } from '@/pages/Prototype/types';
import { NLPContext } from '@/pages/Skill/contexts';
import { FadeLeftContainer } from '@/styles/animations';
import { SlideOutDirection } from '@/styles/transitions';
import { ConnectedProps } from '@/types';

import { Container, EmbedContainer, TrainingSection } from './components';

export type PrototypeSidebarProps = {
  open: boolean;
};

const PrototypeSidebar: React.FC<PrototypeSidebarProps & ConnectedPrototypeSidebarProps> = ({
  open,
  settings,
  saveActiveDiagram,
  renderPrototype,
  isMuted,
  updatePrototype,
  status,
  platform,
}) => {
  const theme = useTheme();
  const isGeneralPlatform = platform === PlatformType.GENERAL;

  const [trainingOpen, toggleTrainingOpen] = useToggle(true);
  const [loading, enableLoading, disableLoading] = useEnableDisable(true);
  const resetPrototype = useResetPrototype();
  const nlp = React.useContext(NLPContext)!;
  const engine = useEventualEngine();
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

    const renderAbortControl = { aborted: false };

    engine()?.focus.reset();
    enableLoading();

    // eslint-disable-next-line promise/catch-or-return
    saveActiveDiagram()
      .catch((err) => console.error(err))
      .then(() => renderPrototype(renderAbortControl))
      .then(disableLoading);

    return () => {
      renderAbortControl.aborted = true;

      resetPrototype();
    };
  }, [open]);

  const isModelTraining = nlp.publishing || nlp.job?.stage.type === NLPTrainStageType.PROGRESS || nlp.job?.stage.type === NLPTrainStageType.IDLE;

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
            {isGeneralPlatform && (
              <TrainingSection isOpen={trainingOpen} onOpen={openTraining} isTraining={isModelTraining} toggleOpen={toggleTrainingOpen} />
            )}

            <Section
              header="DIALOG"
              variant={SectionVariant.PROTOTYPE}
              customHeaderStyling={{
                background: isGeneralPlatform || (!atTop && !notStarted) ? '#fff' : '#FDFDFD',
              }}
              isRounded
              suffix={
                <Flex>
                  <Box display="inline-block" mr={15}>
                    <Tooltip title={isMuted ? 'Unmute Dialog Audio' : 'Mute Dialog Audio'}>
                      <SvgIcon icon={isMuted ? 'soundOff' : 'sound'} clickable onClick={() => updatePrototype({ muted: !isMuted })} />
                    </Tooltip>
                  </Box>

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
              <Prototype debug={settings.debug} atTop={atTop} setAtTop={setAtTop} isModelTraining={isModelTraining} />
            </EmbedContainer>
          </Container>
        )}
      </Drawer>
    </>
  );
};

const mapStateToProps = {
  status: PrototypeDuck.prototypeStatusSelector,
  isMuted: PrototypeDuck.prototypeMutedSelector,
  settings: Recent.recentPrototypeSelector,
  platform: Skill.activePlatformSelector,
};

const mapDispatchToProps = {
  renderPrototype: PrototypeDuck.renderPrototype,
  updatePrototype: PrototypeDuck.updatePrototype,
  saveActiveDiagram: Diagram.saveActiveDiagram,
};

type ConnectedPrototypeSidebarProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PrototypeSidebar) as React.FC<PrototypeSidebarProps>;
