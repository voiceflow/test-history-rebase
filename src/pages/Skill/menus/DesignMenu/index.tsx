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
import { ConnectedProps } from '@/types';

import { Container, Content, Flows, Header, Steps } from './components';
import { TABS, Tab } from './constants';

const DesignMenu: React.FC<ConnectedDesignMenuProps> = ({
  isHidden,
  activeTab,
  toggleIsHidden,
  showCreatorMenu,
  hideCreatorMenu,
  isViewerOrLibraryRole,
  selectActiveTab,
  canvasOnly,
}) => {
  const [isEditingMode] = usePermission(Permission.EDIT_CANVAS);
  const isAnyModeOpen = useAnyModeOpen();
  const [isOpenByHover, openByHover, closeByLoseHover] = useEnableDisable(false);

  const selectedTab = React.useMemo(() => {
    if (isViewerOrLibraryRole) {
      return Tab.FLOWS;
    }

    return Object.values(Tab).includes(activeTab as Tab) ? (activeTab as Tab) : Tab.STEPS;
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

  useHotKeys(
    Hotkey.TOGGLE_LEFT_SIDEBAR_LOCK,
    () => {
      toggleIsHidden();

      if (isOpenByHover) {
        closeByLoseHover();
      }
    },
    { preventDefault: true },
    [isOpenByHover]
  );

  useHotKeys(
    Hotkey.CLOSE_LEFT_SIDEBAR,
    () => {
      if (!isOpenByHover) return;
      closeByLoseHover();
    },
    { preventDefault: true },
    [isOpenByHover]
  );

  useDidUpdateEffect(() => {
    events.trackCanvasMenuLock({ state: isHidden ? Tracking.CanvasMenuLockState.UNLOCKED : Tracking.CanvasMenuLockState.LOCKED });
  }, [isHidden]);

  // This useDrop doesnt do anything functional, but it prevents the awful lag when dropping steps back onto the
  // step menu
  const [, dropRef] = useDrop({ accept: DragItem.BLOCK_MENU });

  const canBeOpened = !isAnyModeOpen && (isEditingMode || isViewerOrLibraryRole);
  const isOpen = (!isHidden || isOpenByHover) && canBeOpened;

  return (
    <Container
      id={Identifier.DESIGN_MENU}
      isOpen={isOpen}
      onMouseEnter={canBeOpened ? openByHover : undefined}
      onMouseLeave={canBeOpened ? closeByLoseHover : undefined}
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
};

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

type ConnectedDesignMenuProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(DesignMenu);
