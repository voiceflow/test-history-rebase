import React from 'react';

import CustomScrollbars from '@/components/CustomScrollbars';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { useEnableDisable, useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { EditPermissionContext } from '@/pages/Canvas/contexts';
import { preventDefault } from '@/utils/dom';

import { Container, Content, Header, ScrollbarsContainer, Steps } from './components';
import { TABS, Tab } from './constants';

// TODO: Do not forget to remove old hotkeys from the CanvasContainer.jsx
function LeftSidebar({ isHidden, activeTab, toggleIsHidden, selectActiveTab }) {
  const { canEdit } = React.useContext(EditPermissionContext);
  const scrollbarsRef = React.useRef();
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
    <Container isOpen={isOpen} onMouseEnter={canEdit ? openByHover : null} onMouseLeave={canEdit ? closeByLoseHover : null}>
      <Content isOpen={isOpen} activeTab={selectedTab}>
        <Header tabs={TABS} locked={!isHidden} toggleLock={toggleIsHidden} selectedTab={selectedTab} selectActiveTab={selectActiveTab} />

        <ScrollbarsContainer ref={scrollbarsRef}>
          <CustomScrollbars>{selectedTab === Tab.STEPS && <Steps />}</CustomScrollbars>
        </ScrollbarsContainer>
      </Content>
    </Container>
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
