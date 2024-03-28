import { Resizable } from '@voiceflow/ui';
import React from 'react';

import { useDidUpdateEffect, useEnableDisable, useIsLockedProjectViewer, useIsPreviewer, useTheme } from '@/hooks';
import { useLocalStorageState } from '@/hooks/storage.hook';
import StepMenu from '@/pages/Project/components/StepMenu';

import Layers from './Layers';
import ResizeHandle from './ResizeHandle';
import * as S from './styles';

interface DesignMenuProps {
  canvasOnly: boolean;
}

const DesignMenu: React.FC<DesignMenuProps> = ({ canvasOnly }) => {
  const theme = useTheme();
  const isPreviewer = useIsPreviewer();
  const isLockedProjectViewer = useIsLockedProjectViewer();

  const [menuWidth, setWidth] = useLocalStorageState<number>(`design-menu-sizes`, theme.components.designMenu.width);
  const [isOpen, openMenu, closeMenu] = useEnableDisable(true);
  const [isCollapsed, setIsCollapsed] = useLocalStorageState<boolean>(`design-menu-is-collapsed`, false);

  useDidUpdateEffect(() => {
    if (canvasOnly) {
      closeMenu(); // canvas only mode should unlock the step menu
    } else {
      openMenu();
    }
  }, [canvasOnly]);

  return (
    <S.FullHeightContainer menuWidth={menuWidth} isOpen={isOpen && !isCollapsed} canvasOnly={canvasOnly || isPreviewer || isLockedProjectViewer}>
      <StepMenu />
      <Resizable
        disabled={isCollapsed}
        axis="x"
        onResizeEnd={([width]) => setWidth(width)}
        width={menuWidth}
        minWidth={theme.components.designMenu.minWidth}
        maxWidth={theme.components.designMenu.maxWidth}
        renderHandle={({ onMouseDown }) => (
          <ResizeHandle onMouseDown={onMouseDown} isOpen={!isCollapsed} onClick={() => setIsCollapsed(!isCollapsed)} />
        )}
      >
        <S.Content>
          <Layers />
        </S.Content>
      </Resizable>
    </S.FullHeightContainer>
  );
};

export default DesignMenu;
