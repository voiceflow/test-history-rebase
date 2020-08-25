import React from 'react';
import { Tooltip } from 'react-tippy';

import Drawer from '@/components/Drawer';
import { FlexCenter } from '@/components/Flex';
import { LoadCircle } from '@/components/Loader';
import { SectionToggleVariant, UncontrolledSection as Section } from '@/components/Section';
import SvgIcon from '@/components/SvgIcon';
import { FeatureFlag } from '@/config/features';
import { EventualEngineContext } from '@/contexts';
import * as Diagram from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Modal from '@/ducks/modal';
import * as Prototype from '@/ducks/prototype';
import * as Recent from '@/ducks/recent';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { useEnableDisable, useToggle } from '@/hooks/toggle';
import PrototypePage from '@/pages/Prototype';
import { usePrototypingMode } from '@/pages/Skill/hooks';
import { compose } from '@/utils/functional';

import PrototypeSettings from './components/PrototypeSettings';
import Container from './components/PrototypeSidebarContainer';
import EmbedContainer from './components/PrototypeSidebarEmbedContainer';
import { PROTOTYPE_SIDEBAR_WIDTH } from './constants';

const PrototypeSidebar = ({ settings, renderPrototype, resetPrototype, saveActiveDiagram, saveActiveDiagramV2, renderPrototypeV2 }) => {
  const [settingsOpen, toggleSettingsOpen] = useToggle();
  const [loading, enableLoading, disableLoading] = useEnableDisable(true);
  const isPrototypingMode = usePrototypingMode();
  const dataRefactor = useFeature(FeatureFlag.DATA_REFACTOR);
  const eventualEngine = React.useContext(EventualEngineContext);

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
            <Section header="Settings" collapseVariant={SectionToggleVariant.ARROW} onClick={toggleSettingsOpen} isCollapsed={!settingsOpen} />
            <Section
              header="Dialog"
              suffix={
                <Tooltip title="Reset Test">
                  <SvgIcon icon="restart" clickable onClick={resetPrototype} />
                </Tooltip>
              }
            />
            <EmbedContainer>{isPrototypingMode && <PrototypePage debug={settings.debug} />}</EmbedContainer>
          </Container>
        )}
      </Drawer>
    </>
  );
};

const mapStateToProps = {
  settings: Recent.recentprototypeSelector,
};

const mapDispatchToProps = {
  setError: Modal.setError,
  resetPrototype: Prototype.resetPrototype,
  renderPrototype: Prototype.renderPrototype,
  renderPrototypeV2: Prototype.renderPrototypeV2,
  saveActiveDiagram: Diagram.saveActiveDiagram,
  saveActiveDiagramV2: DiagramV2.saveActiveDiagram,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(PrototypeSidebar);
