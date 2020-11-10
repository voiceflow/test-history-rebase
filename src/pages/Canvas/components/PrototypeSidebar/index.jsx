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
import * as Modal from '@/ducks/modal';
import * as Prototype from '@/ducks/prototype';
import { prototypeStatusSelector } from '@/ducks/prototype';
import * as Recent from '@/ducks/recent';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { useEnableDisable, useToggle } from '@/hooks/toggle';
import PrototypePage from '@/pages/Prototype';
import PrototypeDeveloper from '@/pages/Prototype/components/PrototypePage/components/PrototypeDeveloper';
import { PMStatus } from '@/pages/Prototype/types';
import { usePrototypingMode } from '@/pages/Skill/hooks';
import { compose } from '@/utils/functional';

import Container from './components/PrototypeSidebarContainer';
import EmbedContainer from './components/PrototypeSidebarEmbedContainer';
import { PROTOTYPE_SIDEBAR_WIDTH } from './constants';

const PrototypeSidebar = ({ settings, resetPrototype, saveActiveDiagram, renderPrototypeV2, isMuted, updatePrototype, status }) => {
  const prototypeTestEnabled = useFeature(FeatureFlag.PROTOTYPE_TEST).isEnabled;
  const [settingsOpen, toggleSettingsOpen] = useToggle();
  const [loading, enableLoading, disableLoading] = useEnableDisable(true);
  const isPrototypingMode = usePrototypingMode();
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
    saveActiveDiagram()
      .catch((err) => console.error(err))
      .then(async () => {
        await renderPrototypeV2(renderAbortControl);
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
      {isPrototypingMode && <PrototypeDeveloper open={settingsOpen} />}
      <Drawer as="section" open={isPrototypingMode} width={PROTOTYPE_SIDEBAR_WIDTH} direction="left">
        {loading ? (
          <FlexCenter style={{ height: '100%' }}>
            <LoadCircle />
          </FlexCenter>
        ) : (
          <Container>
            {!prototypeTestEnabled && (
              <Section
                header="SETTINGS"
                variant={SectionVariant.PROTOTYPE}
                collapseVariant={SectionToggleVariant.ARROW}
                onClick={toggleSettingsOpen}
                isCollapsed={!settingsOpen}
              />
            )}
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
  renderPrototypeV2: Prototype.renderPrototypeV2,
  saveActiveDiagram: Diagram.saveActiveDiagram,
  updatePrototype: Prototype.updatePrototype,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(PrototypeSidebar);
