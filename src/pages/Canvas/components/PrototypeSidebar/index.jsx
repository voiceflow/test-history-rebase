import React from 'react';
import { Tooltip } from 'react-tippy';

import Drawer from '@/components/Drawer';
import Flex, { FlexCenter } from '@/components/Flex';
import { LoadCircle } from '@/components/Loader';
import { SectionToggleVariant, SectionVariant, UncontrolledSection as Section } from '@/components/Section';
import SvgIcon from '@/components/SvgIcon';
import { FeatureFlag } from '@/config/features';
import { EventualEngineContext } from '@/contexts';
import * as Diagram from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Modal from '@/ducks/modal';
import * as Prototype from '@/ducks/prototype';
import { prototypeStatusSelector } from '@/ducks/prototype';
import * as Recent from '@/ducks/recent';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { useEnableDisable, useToggle } from '@/hooks/toggle';
import PrototypePage from '@/pages/Prototype';
import { PMStatus } from '@/pages/Prototype/types';
import { usePrototypingMode } from '@/pages/Skill/hooks';
import { compose } from '@/utils/functional';

import PrototypeSettings from './components/PrototypeSettings';
import Container from './components/PrototypeSidebarContainer';
import EmbedContainer from './components/PrototypeSidebarEmbedContainer';
import { PROTOTYPE_SIDEBAR_WIDTH } from './constants';

const PrototypeSidebar = ({
  settings,
  renderPrototype,
  resetPrototype,
  saveActiveDiagram,
  saveActiveDiagramV2,
  renderPrototypeV2,
  isMuted,
  updatePrototype,
  status,
}) => {
  const [settingsOpen, toggleSettingsOpen] = useToggle();
  const [loading, enableLoading, disableLoading] = useEnableDisable(true);
  const isPrototypingMode = usePrototypingMode();
  const dataRefactor = useFeature(FeatureFlag.DATA_REFACTOR);
  const eventualEngine = React.useContext(EventualEngineContext);
  const [atTop, setAtTop] = React.useState(true);
  const notStarted = status === PMStatus.IDLE;

  React.useEffect(() => {
    // Reset the custom styling of the header when reset
    if (status === PMStatus.IDLE) {
      setAtTop(true);
    }
  }, [status]);

  React.useEffect(() => {
    if (!isPrototypingMode) {
      return undefined;
    }

    const renderAbortControl = { aborted: false };

    eventualEngine.get()?.focus.reset();
    enableLoading();

    // eslint-disable-next-line promise/catch-or-return
    (dataRefactor?.isEnabled ? saveActiveDiagramV2 : saveActiveDiagram)()
      .catch((err) => console.error(err))
      .then(async () => {
        await (dataRefactor?.isEnabled ? renderPrototypeV2 : renderPrototype)(renderAbortControl);
        disableLoading();
      });

    return () => {
      renderAbortControl.aborted = true;

      toggleSettingsOpen(false);
      resetPrototype();
    };
  }, [isPrototypingMode]);

  return (
    <>
      {isPrototypingMode && <PrototypeSettings open={settingsOpen} />}
      <Drawer as="section" open={isPrototypingMode} width={PROTOTYPE_SIDEBAR_WIDTH} direction="left">
        {loading ? (
          <FlexCenter style={{ height: '100%' }}>
            <LoadCircle />
          </FlexCenter>
        ) : (
          <Container>
            <Section
              header="SETTINGS"
              variant={SectionVariant.PROTOTYPE}
              collapseVariant={SectionToggleVariant.ARROW}
              onClick={toggleSettingsOpen}
              isCollapsed={!settingsOpen}
            />
            <Section
              header="DIALOG"
              variant={SectionVariant.PROTOTYPE}
              customHeaderStyling={{ background: !atTop && !notStarted ? '#fff' : '#FDFDFD' }}
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
                        color={notStarted && '#BECEDC'}
                        clickable={!notStarted}
                        onClick={() => (notStarted ? null : resetPrototype())}
                      />
                    </Tooltip>
                  </div>
                </Flex>
              }
            />
            <EmbedContainer>{isPrototypingMode && <PrototypePage debug={settings.debug} atTop={atTop} setAtTop={setAtTop} />}</EmbedContainer>
          </Container>
        )}
      </Drawer>
    </>
  );
};

const mapStateToProps = {
  settings: Recent.recentprototypeSelector,
  isMuted: Prototype.prototypeMutedSelector,
  status: prototypeStatusSelector,
};

const mapDispatchToProps = {
  setError: Modal.setError,
  resetPrototype: Prototype.resetPrototype,
  renderPrototype: Prototype.renderPrototype,
  renderPrototypeV2: Prototype.renderPrototypeV2,
  saveActiveDiagram: Diagram.saveActiveDiagram,
  saveActiveDiagramV2: DiagramV2.saveActiveDiagram,
  updatePrototype: Prototype.updatePrototype,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(PrototypeSidebar);
