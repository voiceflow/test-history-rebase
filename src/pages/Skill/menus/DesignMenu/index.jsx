import React from 'react';
import { useDrop } from 'react-dnd';

import { DragItem } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { useDidUpdateEffect, useEnableDisable, useHotKeys, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';
import { useEditingMode } from '@/pages/Skill/hooks';
import { Identifier } from '@/styles/constants';

import { Container, Content, Flows, Header, Steps } from './components';
import { TABS, Tab } from './constants';

function DesignMenu({ isHidden, activeTab, toggleIsHidden, selectActiveTab }) {
  const isEditingMode = useEditingMode();
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

  const isOpen = (!isHidden || isOpenByHover) && isEditingMode;

  // This useDrop doesnt do anything functional, but it prevents the awful lag when dropping steps back onto the
  // step menu
  const [, dropRef] = useDrop({
    accept: DragItem.BLOCK_MENU,
  });

  return (
    <Container
      id={Identifier.DESIGN_MENU}
      isOpen={isOpen}
      onMouseEnter={isEditingMode ? openByHover : null}
      onMouseLeave={isEditingMode ? closeByLoseHover : null}
      tabIndex={-1}
      ref={dropRef}
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
