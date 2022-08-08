import { Box } from '@voiceflow/ui';
import React from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { DragItem } from '@/constants';
import { AutoPanningCacheContext } from '@/contexts';
import { useEnableDisable, useEventualEngine, useSetup, useTeardown } from '@/hooks';
import { ClassName } from '@/styles/constants';

import { SubMenuButtonContainer } from '../../SubMenu/components';
import { Label } from './styles';

interface LibraryDragItem {
  type: DragItem;
  label: string;
}

interface SubMenuButtonProps {
  label: string;
  onDrop: VoidFunction;
  isDraggingPreview?: boolean;
}

const LibrarySubMenuButton: React.FC<SubMenuButtonProps> = ({ label, onDrop, isDraggingPreview }) => {
  const getEngine = useEventualEngine();
  const isAutoPanning = React.useContext(AutoPanningCacheContext);
  const [isClickedState, enableClickedState, clearClickedState] = useEnableDisable();

  const [{ isDragging }, connectDrag, connectPreview] = useDrag<LibraryDragItem, unknown, { isDragging: boolean }>({
    item: { type: DragItem.TEMPLATES, label },
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

  return (
    <SubMenuButtonContainer
      ref={connectDrag}
      isClicked={isClickedState}
      onMouseUp={clearClickedState}
      onMouseDown={enableClickedState}
      isDragging={isDragging}
      isDraggingPreview={isDraggingPreview}
      className={ClassName.SUB_STEP_MENU_ITEM}
      customDisplay="block"
    >
      <Box opacity={isDragging ? 0 : 1} display="block">
        <Label>{label}</Label>
      </Box>
    </SubMenuButtonContainer>
  );
};

export default React.memo(LibrarySubMenuButton);
