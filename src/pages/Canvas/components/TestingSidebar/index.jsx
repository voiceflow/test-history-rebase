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
import { recentTestingSelector } from '@/ducks/recent';
import { renderTesting, resetTesting } from '@/ducks/testingV2';
import { connect } from '@/hocs';
import { useEnableDisable, useToggle } from '@/hooks/toggle';
import { EditPermissionContext } from '@/pages/Canvas/contexts';
import Testing from '@/pages/TestingV2';
import { compose } from '@/utils/functional';

import Container from './components/TestSidebarContainer';
import TestingContainer from './components/TestSidebarTestingContainer';
import TestSettings from './components/TestingSettings';
import { TESTING_SIDEBAR_WIDTH } from './constants';

const TestingSidebar = ({ settings, renderTesting, resetTesting, saveActiveDiagram }) => {
  const [settingsOpen, toggleSettingsOpen] = useToggle();
  const [loading, enableLoading, disableLoading] = useEnableDisable(true);
  const { isTesting: isOpen } = React.useContext(EditPermissionContext);
  const eventualEngine = React.useContext(EventualEngineContext);

  React.useEffect(() => {
    if (isOpen) {
      eventualEngine.get()?.focus.reset();
      enableLoading();

      // eslint-disable-next-line promise/catch-or-return
      saveActiveDiagram()
        .catch((err) => console.error(err))
        .then(async () => {
          await renderTesting();
          disableLoading();
        });

      return () => {
        toggleSettingsOpen(false);
        resetTesting();
      };
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && <TestSettings open={settingsOpen} />}
      <Drawer as="section" open={isOpen} width={TESTING_SIDEBAR_WIDTH} direction="left">
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
                  <SvgIcon icon="restart" clickable onClick={resetTesting} />
                </Tooltip>
              }
            />
            <TestingContainer>{isOpen && <Testing debug={settings.debug} />}</TestingContainer>
          </Container>
        )}
      </Drawer>
    </>
  );
};

const mapStateToProps = {
  settings: recentTestingSelector,
};

const mapDispatchToProps = {
  setError,
  resetTesting,
  renderTesting,
  saveActiveDiagram,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(TestingSidebar);
