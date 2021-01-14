import React from 'react';
import { Tooltip } from 'react-tippy';
import { useTheme } from 'styled-components';

import Drawer from '@/components/Drawer';
import Flex, { FlexCenter } from '@/components/Flex';
import { LoadCircle } from '@/components/Loader';
import { SectionToggleVariant, SectionVariant, UncontrolledSection as Section } from '@/components/Section';
import SvgIcon from '@/components/SvgIcon';
import { NLPTrainStageType } from '@/constants/platforms';
import * as Diagram from '@/ducks/diagram';
import * as PrototypeDuck from '@/ducks/prototype';
import { PrototypeStatus } from '@/ducks/prototype';
import * as Recent from '@/ducks/recent';
import { connect } from '@/hocs';
import { useDidUpdateEffect, useEventualEngine, useGeneralPrototype } from '@/hooks';
import { useEnableDisable, useToggle } from '@/hooks/toggle';
import Prototype from '@/pages/Prototype';
import { useResetPrototype } from '@/pages/Prototype/hooks';
import { PMStatus } from '@/pages/Prototype/types';
import { NLPContext } from '@/pages/Skill/contexts';
import { Theme } from '@/styles/theme';
import { SlideOutDirection } from '@/styles/transitions';
import { ConnectedProps } from '@/types';

import { Container, EmbedContainer, TrainContainer, TrainFadeDown, Trained, Training } from './components';

export type PrototypeSidebarProps = {
  open: boolean;
};

const PrototypeSidebar: React.FC<PrototypeSidebarProps & ConnectedPrototypeSidebarProps> = ({
  open,
  settings,
  saveActiveDiagram,
  renderPrototype,
  renderPrototypeV2,
  isMuted,
  updatePrototype,
  status,
}) => {
  const theme = useTheme() as Theme;
  const generalPrototypeEnabled = useGeneralPrototype().isEnabled;

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
      .finally(async () => {
        await (generalPrototypeEnabled ? renderPrototypeV2(renderAbortControl) : renderPrototype(renderAbortControl));
        disableLoading();
      });

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
            <LoadCircle />
          </FlexCenter>
        ) : (
          <Container generalPrototypeEnabled={generalPrototypeEnabled}>
            {generalPrototypeEnabled && (
              <Section
                header="TRAINING"
                onClick={toggleTrainingOpen}
                isCollapsed={!trainingOpen}
                collapseVariant={SectionToggleVariant.ARROW}
                variant={SectionVariant.PROTOTYPE}
                customHeaderStyling={{ backgroundColor: 'rgba(238, 244, 246, 0.5)' }}
                customContentStyling={{ backgroundColor: 'rgba(238, 244, 246, 0.5)' }}
              >
                <TrainContainer isModelTraining={isModelTraining}>
                  {isModelTraining ? (
                    <TrainFadeDown key="training">
                      <Training />
                    </TrainFadeDown>
                  ) : (
                    <TrainFadeDown key="trained">
                      <Trained openTraining={openTraining} />
                    </TrainFadeDown>
                  )}
                </TrainContainer>
              </Section>
            )}
            <Section
              header="DIALOG"
              variant={SectionVariant.PROTOTYPE}
              customHeaderStyling={{
                background: generalPrototypeEnabled || (!atTop && !notStarted) ? '#fff' : '#FDFDFD',
              }}
              isRounded
              suffix={
                <Flex>
                  <div style={{ display: 'inline-block', marginRight: '15px' }}>
                    <Tooltip title={isMuted ? 'Unmute Dialog Audio' : 'Mute Dialog Audio'}>
                      <SvgIcon icon={isMuted ? 'soundOff' : 'sound'} clickable onClick={() => updatePrototype({ muted: !isMuted })} />
                    </Tooltip>
                  </div>
                  <div style={{ display: 'inline-block' }}>
                    <Tooltip title="Reset Test">
                      <SvgIcon
                        icon="restart"
                        color={notStarted ? '#BECEDC' : undefined}
                        clickable={!notStarted}
                        onClick={() => (notStarted ? null : resetPrototype())}
                      />
                    </Tooltip>
                  </div>
                </Flex>
              }
            />
            <EmbedContainer generalPrototypeEnabled={generalPrototypeEnabled}>
              <Prototype debug={settings.debug} atTop={atTop} setAtTop={setAtTop} isModelTraining={isModelTraining} />
            </EmbedContainer>
          </Container>
        )}
      </Drawer>
    </>
  );
};

const mapStateToProps = {
  settings: Recent.recentPrototypeSelector,
  isMuted: PrototypeDuck.prototypeMutedSelector,
  status: PrototypeDuck.prototypeStatusSelector,
};

const mapDispatchToProps = {
  renderPrototype: PrototypeDuck.renderPrototype,
  renderPrototypeV2: PrototypeDuck.renderPrototypeV2,
  saveActiveDiagram: Diagram.saveActiveDiagram,
  updatePrototype: PrototypeDuck.updatePrototype,
};

type ConnectedPrototypeSidebarProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PrototypeSidebar) as React.FC<PrototypeSidebarProps>;
