import React from 'react';
import { Tooltip } from 'react-tippy';

import Drawer from '@/components/Drawer';
import { FlexCenter } from '@/components/Flex';
import { LoadCircle } from '@/components/Loader';
import { SectionToggleVariant, UncontrolledSection as Section } from '@/components/Section';
import SvgIcon from '@/components/SvgIcon';
import { EventualEngineContext } from '@/contexts';
import { saveActiveDiagram } from '@/ducks/diagram';
import { setError } from '@/ducks/modal';
import { renderPrototype, resetPrototype } from '@/ducks/prototype';
import { recentprototypeSelector } from '@/ducks/recent';
import { connect } from '@/hocs';
import { useEnableDisable, useToggle } from '@/hooks/toggle';
import Prototype from '@/pages/Prototype';
import { usePrototypingMode } from '@/pages/Skill/hooks';
import { compose } from '@/utils/functional';

import PrototypeSettings from './components/PrototypeSettings';
import Container from './components/PrototypeSidebarContainer';
import EmbedContainer from './components/PrototypeSidebarEmbedContainer';
import { PROTOTYPE_SIDEBAR_WIDTH } from './constants';

const PrototypeSidebar = ({ settings, renderPrototype, resetPrototype, saveActiveDiagram }) => {
  const [settingsOpen, toggleSettingsOpen] = useToggle();
  const [loading, enableLoading, disableLoading] = useEnableDisable(true);
  const isPrototypingMode = usePrototypingMode();
  const eventualEngine = React.useContext(EventualEngineContext);

  React.useEffect(() => {
    if (isPrototypingMode) {
      eventualEngine.get()?.focus.reset();
      enableLoading();

      // eslint-disable-next-line promise/catch-or-return
      saveActiveDiagram()
        .catch((err) => console.error(err))
        .then(async () => {
          await renderPrototype();
          disableLoading();
        });

      return () => {
        toggleSettingsOpen(false);
        resetPrototype();
      };
    }
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
            <Section header="Settings" collapseVariant={SectionToggleVariant.ARROW} onClick={toggleSettingsOpen} isCollapsed={!settingsOpen} />
            <Section
              header="Dialog"
              suffix={
                <Tooltip title="Reset Test">
                  <SvgIcon icon="restart" clickable onClick={resetPrototype} />
                </Tooltip>
              }
            />
            <EmbedContainer>{isPrototypingMode && <Prototype debug={settings.debug} />}</EmbedContainer>
          </Container>
        )}
      </Drawer>
    </>
  );
};

const mapStateToProps = {
  settings: recentprototypeSelector,
};

const mapDispatchToProps = {
  setError,
  resetPrototype,
  renderPrototype,
  saveActiveDiagram,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(PrototypeSidebar);
