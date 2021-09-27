import { useDidUpdateEffect, useEnableDisable } from '@voiceflow/ui';
import React from 'react';
import { useDrop } from 'react-dnd';

import { Permission } from '@/config/permissions';
import { DragItem, ModalType } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import * as UI from '@/ducks/ui';
import { useDispatch, useHotKeys, useModals, usePermission, useSelector, useTheme, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';
import { useAnyModeOpen } from '@/pages/Skill/hooks';
import { Identifier } from '@/styles/constants';

import { Container, Content, Flows, Header, Steps } from './components';
import { Tab, TABS } from './constants';

const SIDEBAR_CALCULATION_BUFFER = 50;

const DesignMenu: React.FC = () => {
  const imModal = useModals(ModalType.INTERACTION_MODEL);

  const isHidden = useSelector(UI.isCreatorMenuHiddenSelector);
  const activeTab = useSelector(UI.activeCreatorMenuSelector);
  const canvasOnly = useSelector(UI.isCanvasOnlyShowingSelector);

  const toggleIsHidden = useDispatch(UI.toggleCreatorMenuHidden);
  const hideCreatorMenu = useDispatch(UI.hideCreatorMenu);
  const showCreatorMenu = useDispatch(UI.showCreatorMenu);
  const selectActiveTab = useDispatch(UI.setActiveCreatorMenu);

  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
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
    if (!canEditCanvas) {
      return Tab.FLOWS;
    }

    return Object.values(Tab).includes(activeTab as Tab) ? (activeTab as Tab) : Tab.STEPS;
  }, [activeTab, canEditCanvas]);
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
    { preventDefault: true, disable: imModal.isOpened },
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

  const canBeOpened = !isAnyModeOpen;
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
    >
      <Content isOpen={isOpen} activeTab={selectedTab} ref={designMenuRef}>
        <Header
          tabs={canEditCanvas ? TABS : TABS.filter((tab) => tab.value === Tab.FLOWS)}
          locked={!isHidden}
          toggleLock={toggleIsHidden}
          selectedTab={selectedTab}
          selectActiveTab={selectActiveTab}
        />
        {selectedTab === Tab.STEPS && canEditCanvas && <Steps />}
        {selectedTab === Tab.FLOWS && <Flows />}
      </Content>
    </Container>
  );
};

export default DesignMenu;
