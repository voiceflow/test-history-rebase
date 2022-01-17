import { Box, Flex, FlexCenter, LoadCircle, SvgIcon, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';
import { Tooltip } from 'react-tippy';

import Drawer from '@/components/Drawer';
import { SectionVariant, UncontrolledSection as Section } from '@/components/Section';
import SoundToggle from '@/components/SoundToggle';
import { Permission } from '@/config/permissions';
import * as Diagram from '@/ducks/diagram';
import * as ProjectV2 from '@/ducks/projectV2';
import * as PrototypeDuck from '@/ducks/prototype';
import { PrototypeStatus } from '@/ducks/prototype';
import { connect } from '@/hocs';
import { useEventualEngine, usePermission, useTheme } from '@/hooks';
import { useEnableDisable, useToggle } from '@/hooks/toggle';
import { NLPContext } from '@/pages/Project/contexts';
import Prototype from '@/pages/Prototype';
import { useDebug, useResetPrototype } from '@/pages/Prototype/hooks';
import { PMStatus } from '@/pages/Prototype/types';
import { FadeLeftContainer } from '@/styles/animations';
import { SlideOutDirection } from '@/styles/transitions';
import { ConnectedProps } from '@/types';
import { canUseSoundToggle } from '@/utils/prototype';
import { isChatbotPlatform } from '@/utils/typeGuards';
import * as Sentry from '@/vendors/sentry';

import { Container, EmbedContainer, TrainingSection } from './components';

export interface PrototypeSidebarProps {
  open: boolean;
}

const PrototypeSidebar: React.FC<PrototypeSidebarProps & ConnectedPrototypeSidebarProps> = ({
  open,
  status,
  isMuted,
  platform,
  updatePrototype,
  compilePrototype,
  saveActiveDiagram,
}) => {
  const theme = useTheme();
  const debugEnabled = useDebug();
  const [canRenderPrototype] = usePermission(Permission.RENDER_PROTOTYPE);

  const canSeeSoundToggle = canUseSoundToggle(platform);

  const [trainingOpen, toggleTrainingOpen] = useToggle(true);
  const [loading, enableLoading, disableLoading] = useEnableDisable(true);
  const resetPrototype = useResetPrototype();
  const nlp = React.useContext(NLPContext)!;
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

    if (isChatbotPlatform(platform)) {
      updatePrototype({ muted: true });
    }

    const renderAbortControl = { aborted: false };

    if (canRenderPrototype) {
      (async () => {
        enableLoading();

        await saveActiveDiagram().catch(Sentry.error);
        await compilePrototype(renderAbortControl);

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

  const isModelTraining = nlp.publishing || !!nlp.job;

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
            {canRenderPrototype && (
              <TrainingSection isOpen={trainingOpen} onOpen={openTraining} isTraining={isModelTraining} toggleOpen={toggleTrainingOpen} />
            )}

            <Section
              header="DIALOG"
              variant={SectionVariant.PROTOTYPE}
              isRounded={canRenderPrototype}
              suffix={
                <Flex>
                  {canSeeSoundToggle && (
                    <Box display="inline-block" mr={15}>
                      <SoundToggle platform={platform} isMuted={isMuted} onClick={() => updatePrototype({ muted: !isMuted })} />
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
              <Prototype debug={debugEnabled} atTop={atTop} setAtTop={setAtTop} isModelTraining={isModelTraining} />
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
  platform: ProjectV2.active.platformSelector,
};

const mapDispatchToProps = {
  updatePrototype: PrototypeDuck.updatePrototype,
  compilePrototype: PrototypeDuck.compilePrototype,
  saveActiveDiagram: Diagram.saveActiveDiagram,
};

type ConnectedPrototypeSidebarProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PrototypeSidebar) as React.FC<PrototypeSidebarProps>;
