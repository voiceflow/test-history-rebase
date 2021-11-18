import { useDidUpdateEffect, useEnableDisable } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import * as Tracking from '@/ducks/tracking';
import * as UI from '@/ducks/ui';
import { useDispatch, usePermission, useSelector, useTheme, useTrackingEvents } from '@/hooks';
import { useAnyModeOpen } from '@/pages/Project/hooks';
import { Identifier } from '@/styles/constants';

import { Container, Content, Flows, Header, Layers, Steps } from './components';
import { Tab } from './constants';
import { useDropLagFix, useMenuHotKeys, useTabs } from './hooks';

export { Tab as DesignMenuTab } from './constants';

const SIDEBAR_CALCULATION_BUFFER = 50;

const DesignMenu: React.FC = () => {
  const designMenuRef = React.useRef<HTMLDivElement>(null);

  const isHidden = useSelector(UI.isCreatorMenuHiddenSelector);
  const canvasOnly = useSelector(UI.isCanvasOnlyShowingSelector);

  const setActiveTab = useDispatch(UI.setActiveCreatorMenu);
  const toggleIsHidden = useDispatch(UI.toggleCreatorMenuHidden);
  const hideCreatorMenu = useDispatch(UI.hideCreatorMenu);
  const showCreatorMenu = useDispatch(UI.showCreatorMenu);

  const theme = useTheme();
  const [events] = useTrackingEvents();
  const isAnyModeOpen = useAnyModeOpen();
  const useDropLagFixRef = useDropLagFix();
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const { tabs, selectedTab } = useTabs();
  const [isOpenByHover, openByHover, closeByLoseHover] = useEnableDisable(false);

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

  useMenuHotKeys({
    openByHover,
    setActiveTab,
    isOpenByHover,
    toggleIsHidden,
    closeByLoseHover,
  });

  useDidUpdateEffect(() => {
    if (canvasOnly) {
      hideCreatorMenu(); // canvas only mode should unlock the step menu
    } else {
      showCreatorMenu();
    }
  }, [canvasOnly]);

  useDidUpdateEffect(() => {
    events.trackCanvasMenuLock({ state: isHidden ? Tracking.CanvasMenuLockState.UNLOCKED : Tracking.CanvasMenuLockState.LOCKED });
  }, [isHidden]);

  const canBeOpened = !isAnyModeOpen;

  const isOpen = (!isHidden || isOpenByHover) && canBeOpened;

  return (
    <Container
      id={Identifier.DESIGN_MENU}
      ref={useDropLagFixRef}
      isOpen={isOpen}
      locked={!isHidden}
      tabIndex={-1}
      canvasOnly={canvasOnly}
      onMouseEnter={canBeOpened ? openByHover : undefined}
      onMouseLeave={canBeOpened ? mouseLeaveHandler : undefined}
    >
      <Content isOpen={isOpen} activeTab={selectedTab} ref={designMenuRef}>
        <Header tabs={tabs} locked={!isHidden} toggleLock={toggleIsHidden} selectedTab={selectedTab} selectActiveTab={setActiveTab} />

        {selectedTab === Tab.STEPS && canEditCanvas && <Steps />}
        {selectedTab === Tab.LAYERS && <Layers />}

        {/**
         * TODO: remove when topics and components are merged
         */}
        {selectedTab === Tab.FLOWS && <Flows />}
      </Content>
    </Container>
  );
};

export default DesignMenu;
