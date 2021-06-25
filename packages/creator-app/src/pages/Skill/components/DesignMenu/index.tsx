import { useDidUpdateEffect, useEnableDisable } from '@voiceflow/ui';
import React from 'react';
import { useDrop } from 'react-dnd';

import { FeatureFlag } from '@/config/features';
import { Permission } from '@/config/permissions';
import { DragItem } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import * as UI from '@/ducks/ui';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useFeature, useHotKeys, usePermission, useTheme, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';
import { useAnyModeOpen } from '@/pages/Skill/hooks';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import { Container, Content, Flows, Header, Steps } from './components';
import { Tab, TABS } from './constants';

const SIDEBAR_CALCULATION_BUFFER = 50;

const DesignMenu: React.FC<ConnectedDesignMenuProps> = ({
  isHidden,
  activeTab,
  canvasOnly,
  toggleIsHidden,
  showCreatorMenu,
  hideCreatorMenu,
  selectActiveTab,
  isViewerOrLibraryRole,
}) => {
  const navigationRedesign = useFeature(FeatureFlag.NAVIGATION_REDESIGN);
  const [isEditingMode] = usePermission(Permission.EDIT_CANVAS);
  const isAnyModeOpen = useAnyModeOpen();
  const [isOpenByHover, openByHover, closeByLoseHover] = useEnableDisable(false);
  const designMenuRef = React.useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const mouseLeaveHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const menuRect = designMenuRef?.current?.getBoundingClientRect() || null;

    // Add a small buffer space because sometimes the mouse moves too fast and without the buffer, the mouse out calculation won't trigger
    if (
      e.clientX > theme.components.leftSidebar.width - SIDEBAR_CALCULATION_BUFFER ||
      e.clientY < (menuRect?.top || 0) ||
      e.clientY > (menuRect?.bottom || 0)
    ) {
      closeByLoseHover();
    }
  };

  const selectedTab = React.useMemo(() => {
    if (isViewerOrLibraryRole) {
      return Tab.FLOWS;
    }

    return Object.values(Tab).includes(activeTab as Tab) ? (activeTab as Tab) : Tab.STEPS;
  }, [activeTab, isViewerOrLibraryRole]);
  const [events] = useTrackingEvents();

  useDidUpdateEffect(() => {
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

  React.useEffect(
    () => () => {
      dropRef(null);
    },
    [dropRef]
  );

  const canBeOpened = !isAnyModeOpen && (isEditingMode || isViewerOrLibraryRole);
  const isOpen = (!isHidden || isOpenByHover) && canBeOpened;

  return (
    <Container
      id={Identifier.DESIGN_MENU}
      isOpen={isOpen}
      onMouseEnter={canBeOpened ? openByHover : undefined}
      onMouseLeave={canBeOpened ? mouseLeaveHandler : undefined}
      tabIndex={-1}
      ref={dropRef}
      locked={!isHidden}
      canvasOnly={canvasOnly}
      navigationRedesign={!!navigationRedesign.isEnabled}
    >
      <Content isOpen={isOpen} activeTab={selectedTab} ref={designMenuRef} navigationRedesign={!!navigationRedesign.isEnabled}>
        <Header
          tabs={isViewerOrLibraryRole ? TABS.filter((tab) => tab.value === Tab.FLOWS) : TABS}
          locked={!isHidden}
          toggleLock={toggleIsHidden}
          selectedTab={selectedTab}
          selectActiveTab={selectActiveTab}
        />
        {selectedTab === Tab.STEPS && !isViewerOrLibraryRole && <Steps />}
        {selectedTab === Tab.FLOWS && <Flows />}
      </Content>
    </Container>
  );
};

const mapStateToProps = {
  isHidden: UI.isCreatorMenuHiddenSelector,
  activeTab: UI.activeCreatorMenuSelector,
  canvasOnly: UI.isCanvasOnlyShowingSelector,
  isViewerOrLibraryRole: Workspace.isViewerOrLibraryRoleSelector,
};

const mapDispatchToProps = {
  toggleIsHidden: UI.toggleCreatorMenuHidden,
  hideCreatorMenu: UI.hideCreatorMenu,
  showCreatorMenu: UI.showCreatorMenu,
  selectActiveTab: UI.setActiveCreatorMenu,
};

type ConnectedDesignMenuProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(DesignMenu);
