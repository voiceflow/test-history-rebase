import React from 'react';
import { useDrop } from 'react-dnd';

import { Permission } from '@/config/permissions';
import { DragItem } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import * as UI from '@/ducks/ui';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useDidUpdateEffect, useEnableDisable, useHotKeys, usePermission, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';
import { useAnyModeOpen } from '@/pages/Skill/hooks';
import { Identifier } from '@/styles/constants';

import { Container, Content, Flows, Header, Steps } from './components';
import { TABS, Tab } from './constants';

function DesignMenu({ isHidden, activeTab, toggleIsHidden, showCreatorMenu, hideCreatorMenu, isViewerOrLibraryRole, selectActiveTab, canvasOnly }) {
  const [isEditingMode] = usePermission(Permission.EDIT_CANVAS);
  const isAnyModeOpen = useAnyModeOpen();
  const [isOpenByHover, openByHover, closeByLoseHover] = useEnableDisable(false);

  const selectedTab = React.useMemo(() => {
    if (isViewerOrLibraryRole) {
      return Tab.FLOWS;
    }

    return Object.values(Tab).includes(activeTab) ? activeTab : Tab.STEPS;
  }, [activeTab, isViewerOrLibraryRole]);
  const [events] = useTrackingEvents();

  React.useEffect(() => {
    if (canvasOnly) {
      hideCreatorMenu(); // canvas only mode should unlock the step menu
    } else {
      showCreatorMenu();
    }
  }, [canvasOnly]);

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

  const canBeOpened = !isAnyModeOpen && (isEditingMode || isViewerOrLibraryRole);
  const isOpen = (!isHidden || isOpenByHover) && canBeOpened;

  // This useDrop doesnt do anything functional, but it prevents the awful lag when dropping steps back onto the
  // step menu
  const [, dropRef] = useDrop({ accept: DragItem.BLOCK_MENU });

  return (
    <Container
      id={Identifier.DESIGN_MENU}
      isOpen={isOpen}
      onMouseEnter={canBeOpened ? openByHover : null}
      onMouseLeave={canBeOpened ? closeByLoseHover : null}
      tabIndex={-1}
      ref={dropRef}
      canvasOnly={canvasOnly}
    >
      <Content isOpen={isOpen} activeTab={selectedTab}>
        <Header
          tabs={isViewerOrLibraryRole ? TABS.filter((tab) => tab.value === Tab.FLOWS) : TABS}
          locked={!isHidden}
          toggleLock={toggleIsHidden}
          selectedTab={selectedTab}
          selectActiveTab={selectActiveTab}
        />
        {selectedTab === Tab.STEPS && !isViewerOrLibraryRole && <Steps />}
        {selectedTab === Tab.FLOWS && <Flows isOpen={isOpen} />}
      </Content>
    </Container>
  );
}

const mapStateToProps = {
  isHidden: UI.isCreatorMenuHiddenSelector,
  activeTab: UI.activeCreatorMenuSelector,
  isViewerOrLibraryRole: Workspace.isViewerOrLibraryRoleSelector,
  canvasOnly: UI.isCanvasOnlyShowingSelector,
};

const mapDispatchToProps = {
  toggleIsHidden: UI.toggleCreatorMenuHidden,
  hideCreatorMenu: UI.hideCreatorMenu,
  showCreatorMenu: UI.showCreatorMenu,
  selectActiveTab: UI.setActiveCreatorMenu,
};

export default connect(mapStateToProps, mapDispatchToProps)(DesignMenu);
