import { useDidUpdateEffect, useEnableDisable, useLocalStorageState } from '@voiceflow/ui';
import React from 'react';

import Resizable, { ResizablePanel } from '@/components/Resizable';
import { TabPane, TabsContent } from '@/components/Tabs';
import { Permission } from '@/config/permissions';
import { DragItem } from '@/constants';
import { AutoPanningCacheContext } from '@/contexts';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import * as UI from '@/ducks/ui';
import { useDispatch, useDropLagFix, useIsCanvasDesignOnly, usePermission, useSelector, useTheme, useTrackingEvents } from '@/hooks';
import { useAnyModeOpen } from '@/pages/Project/hooks';
import { Identifier } from '@/styles/constants';

import { Content, Flows, FullHeightContainer, Header, Layers, ResizeDivider, ResizePanel, Steps } from './components';
import { Tab } from './constants';
import { useMenuHotKeys, useTabs } from './hooks';

export { Tab as DesignMenuTab } from './constants';

const SIDEBAR_CALCULATION_BUFFER = 50;

const DesignMenu: React.FC = () => {
  const designMenuRef = React.useRef<HTMLDivElement>(null);
  const designOnly = useIsCanvasDesignOnly();

  const isHidden = useSelector(UI.isCreatorMenuHiddenSelector);
  const canvasOnly = useSelector(UI.isCanvasOnlyShowingSelector);
  const isAutoPanning = React.useContext(AutoPanningCacheContext);
  const activeProjectID = useSelector(Session.activeProjectIDSelector);

  const setActiveTab = useDispatch(UI.setActiveCreatorMenu);
  const toggleIsHidden = useDispatch(UI.toggleCreatorMenuHidden);
  const hideCreatorMenu = useDispatch(UI.hideCreatorMenu);
  const showCreatorMenu = useDispatch(UI.showCreatorMenu);

  const [heights, setHeights] = useLocalStorageState(`design-menu-heights.${activeProjectID}`, [100, 0]);

  const theme = useTheme();
  const [events] = useTrackingEvents();
  const isAnyModeOpen = useAnyModeOpen();
  const dropLagFixRef = useDropLagFix([DragItem.BLOCK_MENU, DragItem.TOPICS, DragItem.COMPONENTS]);
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const { tabs, selectedTab } = useTabs();
  const [resizing, onStartResizing, onEndResizing] = useEnableDisable(false);
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

  const mouseEnterHandler = () => {
    if (isAutoPanning.current) return;

    openByHover();
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

  const isOpen = resizing || ((!isHidden || isOpenByHover) && canBeOpened);

  return (
    <FullHeightContainer isOpen={isOpen} canvasOnly={canvasOnly || designOnly}>
      <Resizable
        onResized={setHeights}
        onResizeEnd={onEndResizing}
        onResizeStart={onStartResizing}
        renderDivider={({ onDividerMouseDown }) => <ResizeDivider onMouseDown={onDividerMouseDown} />}
      >
        <ResizePanel
          id={Identifier.DESIGN_MENU}
          ref={dropLagFixRef}
          locked={!isHidden}
          height={heights[0]}
          isOpen={isOpen}
          tabIndex={-1}
          activeTab={selectedTab}
          minHeight={300}
          onMouseEnter={canBeOpened ? mouseEnterHandler : undefined}
          onMouseLeave={canBeOpened ? mouseLeaveHandler : undefined}
        >
          {() => (
            <Content ref={designMenuRef}>
              {canEditCanvas && (
                <Header tabs={tabs} locked={!isHidden} toggleLock={toggleIsHidden} selectedTab={selectedTab} selectActiveTab={setActiveTab} />
              )}

              <TabsContent selected={selectedTab}>
                {canEditCanvas && (
                  <TabPane tabID={Tab.STEPS}>
                    <Steps />
                  </TabPane>
                )}

                <TabPane tabID={Tab.LAYERS}>
                  <Layers />
                </TabPane>

                {/**
                 * TODO: remove when topics and components are merged
                 */}
                <TabPane tabID={Tab.FLOWS}>
                  <Flows />
                </TabPane>
              </TabsContent>
            </Content>
          )}
        </ResizePanel>

        <ResizablePanel height={heights[1]} />
      </Resizable>
    </FullHeightContainer>
  );
};

export default DesignMenu;
