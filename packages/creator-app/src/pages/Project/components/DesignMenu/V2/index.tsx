import { IconButton, Resizable, useLocalStorageState } from '@voiceflow/ui';
import React from 'react';

import { useDidUpdateEffect, useEnableDisable, useTheme } from '@/hooks';
import StepMenu from '@/pages/Project/components/StepMenu';

import { useMenuHotKeys } from './hooks';
import ResizeHandle from './ResizeHandle';
import * as S from './styles';

interface DesignMenuV2Props {
  canvasOnly: boolean;
}

const DesignMenuV2: React.FC<DesignMenuV2Props> = ({ canvasOnly }) => {
  const theme = useTheme();
  const [isOpen, openMenu, closeMenu] = useEnableDisable(true);
  const [menuWidth, setWidth] = useLocalStorageState<number>(`design-menu-v2-sizes`, theme.components.designMenu.width);
  const [isCollapsed, setIsCollapsed] = useLocalStorageState<boolean>(`design-menu-v2-is-collapsed`, false);

  useMenuHotKeys({
    isOpen,
    openMenu,
    closeMenu,
  });

  useDidUpdateEffect(() => {
    if (canvasOnly) {
      closeMenu(); // canvas only mode should unlock the step menu
    } else {
      openMenu();
    }
  }, [canvasOnly]);

  return (
    <S.FullHeightContainer menuWidth={menuWidth} isOpen={isOpen && !isCollapsed} canvasOnly={canvasOnly}>
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
          <S.Header>
            Topics
            <IconButton onClick={() => {}} icon="plus" variant={IconButton.Variant.BASIC} />
          </S.Header>
        </S.Content>
      </Resizable>
    </S.FullHeightContainer>
  );
};

export default DesignMenuV2;
