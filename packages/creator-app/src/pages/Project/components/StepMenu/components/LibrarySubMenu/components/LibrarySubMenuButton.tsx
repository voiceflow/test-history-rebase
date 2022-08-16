import { Box, ContextMenu, OptionsMenuOption } from '@voiceflow/ui';
import React from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { DragItem } from '@/constants';
import { AutoPanningCacheContext } from '@/contexts';
import * as CanvasTemplate from '@/ducks/canvasTemplate';
import { useDispatch, useEnableDisable, useEventualEngine, useSetup, useTeardown } from '@/hooks';
import { ClassName } from '@/styles/constants';

import { LibraryDragItem } from '../../../constants';
import { SubMenuButtonContainer } from '../../SubMenu/components';
import * as S from '../../SubMenu/styles';
import { Label } from './styles';

interface SubMenuButtonProps {
  name: string;
  id: string;
  color: string;
  nodeIDs: string[];
  onDrop: VoidFunction;
  isDraggingPreview?: boolean;
}

const LibrarySubMenuButton: React.FC<SubMenuButtonProps> = ({ name, id, color, nodeIDs, onDrop, isDraggingPreview }) => {
  const getEngine = useEventualEngine();
  const isAutoPanning = React.useContext(AutoPanningCacheContext);
  const [isClickedState, enableClickedState, clearClickedState] = useEnableDisable();
  const deleteTemplate = useDispatch(CanvasTemplate.deleteCanvasTemplate);

  const [{ isDragging }, connectDrag, connectPreview] = useDrag<LibraryDragItem, unknown, { isDragging: boolean }>({
    item: { type: DragItem.TEMPLATES, name, id, color, nodeIDs },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),

    begin: () => {
      getEngine()?.drag.setDraggingToCreate(true);
    },

    end: () => {
      onDrop();
      isAutoPanning.current = false;

      getEngine()?.merge.reset();
      getEngine()?.drag.setDraggingToCreate(false);
    },
  });

  useSetup(() => {
    connectPreview(getEmptyImage(), { captureDraggingState: true });
  });

  useTeardown(() => connectDrag(null), [connectDrag]);

  React.useEffect(() => {
    if (isDragging) {
      clearClickedState();
    }
  }, [isDragging]);

  const menuOptions: OptionsMenuOption[] = React.useMemo(
    () => [
      {
        label: <S.ContextMenuOption>Edit</S.ContextMenuOption>,
      },
      {
        label: <S.ContextMenuOption>Delete</S.ContextMenuOption>,
        onClick: () => deleteTemplate(id),
      },
    ],
    []
  );

  return (
    <ContextMenu options={menuOptions}>
      {({ isOpen, onContextMenu }) => (
        <SubMenuButtonContainer
          ref={connectDrag}
          isClicked={isClickedState}
          onMouseUp={clearClickedState}
          onMouseDown={enableClickedState}
          isDragging={isDragging}
          isDraggingPreview={isDraggingPreview}
          isContextMenuOpen={isOpen}
          onContextMenu={onContextMenu}
          className={ClassName.SUB_STEP_MENU_ITEM}
          customDisplay="block"
        >
          <Box opacity={isDragging ? 0 : 1} display="block">
            <Label>{name}</Label>
          </Box>
        </SubMenuButtonContainer>
      )}
    </ContextMenu>
  );
};

export default React.memo(LibrarySubMenuButton);
