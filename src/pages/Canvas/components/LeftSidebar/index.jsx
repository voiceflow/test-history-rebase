import React from 'react';

import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { useEnableDisable, useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import CanvasControlsV2 from '@/pages/Canvas/components/CanvasControlsV2';
import { EditPermissionContext } from '@/pages/Canvas/contexts';
import { preventDefault } from '@/utils/dom';

import { Container, Content, Flows, Header, Steps } from './components';
import { TABS, Tab } from './constants';

function LeftSidebar({ isHidden, activeTab, toggleIsHidden, selectActiveTab }) {
  const { canEdit } = React.useContext(EditPermissionContext);
  const selectedTab = React.useMemo(() => (Object.values(Tab).includes(activeTab) ? activeTab : Tab.STEPS), [activeTab]);
  const [isOpenByHover, openByHover, closeByLoseHover] = useEnableDisable(false);

  useHotKeys(
    Hotkey.OPEN_LEFT_SIDEBAR_FLOWS_TAB,
    preventDefault(() => {
      selectActiveTab(Tab.FLOWS);
      openByHover();
    })
  );

  useHotKeys(
    Hotkey.OPEN_LEFT_SIDEBAR_STEPS_TAB,
    preventDefault(() => {
      selectActiveTab(Tab.STEPS);
      openByHover();
    })
  );

  useHotKeys(Hotkey.TOGGLE_LEFT_SIDEBAR_LOCK, preventDefault(toggleIsHidden));

  const isOpen = (!isHidden || isOpenByHover) && canEdit;

  return (
    <>
      <Container isOpen={isOpen} onMouseEnter={canEdit ? openByHover : null} onMouseLeave={canEdit ? closeByLoseHover : null}>
        <Content isOpen={isOpen} activeTab={selectedTab}>
          <Header tabs={TABS} locked={!isHidden} toggleLock={toggleIsHidden} selectedTab={selectedTab} selectActiveTab={selectActiveTab} />

          {selectedTab === Tab.STEPS && <Steps />}
          {selectedTab === Tab.FLOWS && <Flows isOpen={isOpen} />}
        </Content>
      </Container>

      <CanvasControlsV2 />
    </>
  );
}

const mapStateToProps = {
  isHidden: UI.isCreatorMenuHiddenSelector,
  activeTab: UI.activeCreatorMenuSelector,
};

const mapDispatchToProps = {
  toggleIsHidden: UI.toggleCreatorMenuHidden,
  selectActiveTab: UI.setOnlyActiveCreatorMenu,
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftSidebar);
