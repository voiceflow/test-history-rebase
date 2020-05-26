import React from 'react';

import * as Tracking from '@/ducks/tracking';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { useDidUpdateEffect, useEnableDisable, useHotKeys, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';
import { EditPermissionContext } from '@/pages/Skill/contexts';
import { Identifier } from '@/styles/constants';

import { Container, Content, Flows, Header, Steps } from './components';
import { TABS, Tab } from './constants';

function DesignMenu({ isHidden, activeTab, toggleIsHidden, selectActiveTab }) {
  const { canEdit } = React.useContext(EditPermissionContext);
  const selectedTab = React.useMemo(() => (Object.values(Tab).includes(activeTab) ? activeTab : Tab.STEPS), [activeTab]);
  const [events] = useTrackingEvents();
  const [isOpenByHover, openByHover, closeByLoseHover] = useEnableDisable(false);

  useHotKeys(
    Hotkey.OPEN_LEFT_SIDEBAR_FLOWS_TAB,
    () => {
      selectActiveTab(Tab.FLOWS);
      openByHover();
    },
    { preventDefault: true }
  );

  useHotKeys(
    Hotkey.OPEN_LEFT_SIDEBAR_STEPS_TAB,
    () => {
      selectActiveTab(Tab.STEPS);
      openByHover();
    },
    { preventDefault: true }
  );

  useHotKeys(Hotkey.TOGGLE_LEFT_SIDEBAR_LOCK, toggleIsHidden, { preventDefault: true });

  useDidUpdateEffect(() => {
    events.trackCanvasMenuLock({ state: isHidden ? Tracking.CanvasMenuLockState.UNLOCKED : Tracking.CanvasMenuLockState.LOCKED });
  }, [isHidden]);

  const isOpen = (!isHidden || isOpenByHover) && canEdit;

  return (
    <Container
      id={Identifier.DESIGN_MENU}
      isOpen={isOpen}
      onMouseEnter={canEdit ? openByHover : null}
      onMouseLeave={canEdit ? closeByLoseHover : null}
      tabIndex={-1}
    >
      <Content isOpen={isOpen} activeTab={selectedTab}>
        <Header tabs={TABS} locked={!isHidden} toggleLock={toggleIsHidden} selectedTab={selectedTab} selectActiveTab={selectActiveTab} />

        {selectedTab === Tab.STEPS && <Steps />}
        {selectedTab === Tab.FLOWS && <Flows isOpen={isOpen} />}
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
  selectActiveTab: UI.setActiveCreatorMenu,
};

export default connect(mapStateToProps, mapDispatchToProps)(DesignMenu);
