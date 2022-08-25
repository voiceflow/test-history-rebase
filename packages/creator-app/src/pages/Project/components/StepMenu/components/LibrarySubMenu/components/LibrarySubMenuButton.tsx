import composeRef from '@seznam/compose-react-refs';
import { Box, ContextMenu, OptionsMenuOption, Portal, toast, useOnClickOutside, usePopper } from '@voiceflow/ui';
import React from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { DragItem } from '@/constants';
import { AutoPanningCacheContext } from '@/contexts';
import * as CanvasTemplate from '@/ducks/canvasTemplate';
import { useDispatch, useEnableDisable, useEventualEngine, useSetup, useTeardown } from '@/hooks';
import { TemplatePopperContent } from '@/pages/Canvas/components/TemplateLibraryPopper/components';
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
  const updateTemplate = useDispatch(CanvasTemplate.updateCanvasTemplate);

  const [isEditing, setEditing] = React.useState(false);

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

  const saveNameChange = (updatedName: string) => {
    if (updatedName !== name) updateTemplate(id, { name: updatedName });
  };

  useTeardown(() => connectDrag(null), [connectDrag]);

  React.useEffect(() => {
    if (isDragging) {
      clearClickedState();
    }
  }, [isDragging]);

  const onColorChange = React.useCallback((color: string) => {
    updateTemplate(id, { color });
  }, []);

  const popperContainerRef = React.useRef<HTMLDivElement>(null);
  useOnClickOutside(
    [popperContainerRef],
    () => {
      setEditing(false);
    },
    [isEditing]
  );

  const popper = usePopper({ strategy: 'fixed', placement: 'right-start', modifiers: [{ name: 'offset', options: { offset: [-12, 0] } }] });

  const menuOptions: OptionsMenuOption[] = React.useMemo(
    () => [
      {
        label: <S.ContextMenuOption>Edit</S.ContextMenuOption>,
        onClick: () => setEditing(true),
      },
      {
        label: <S.ContextMenuOption>Delete</S.ContextMenuOption>,
        onClick: () => {
          deleteTemplate(id);
          toast.success(`Block template removed.`);
        },
      },
    ],
    []
  );

  const setClickedState: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (!isEditing && event.button !== 2) {
      enableClickedState();
    }
  };

  return (
    <ContextMenu options={menuOptions} selfDismiss>
      {({ isOpen, onContextMenu }) => (
        <>
          <SubMenuButtonContainer
            ref={composeRef<HTMLDivElement>(connectDrag, popper.setReferenceElement)}
            isClicked={isClickedState && !isEditing}
            onMouseUp={clearClickedState}
            onMouseDown={setClickedState}
            isDragging={isDragging}
            isDraggingPreview={isDraggingPreview}
            isContextMenuOpen={isOpen || isEditing}
            onContextMenu={onContextMenu}
            className={ClassName.SUB_STEP_MENU_ITEM}
            customDisplay="block"
            isLibrary
          >
            <Box opacity={isDragging ? 0 : 1} display="block">
              <Label>{name}</Label>
            </Box>
          </SubMenuButtonContainer>
          {isEditing && !isDragging && (
            <Portal portalNode={document.body}>
              <div ref={popper.setPopperElement} style={{ ...popper.styles.popper, paddingLeft: '6px' }} {...popper.attributes.popper}>
                <div ref={popperContainerRef}>
                  <TemplatePopperContent
                    onColorChange={onColorChange}
                    onNameChange={saveNameChange}
                    selectedColor={color}
                    nodeIDs={nodeIDs}
                    oldName={name}
                    editing={isEditing}
                  />
                </div>
              </div>
            </Portal>
          )}
        </>
      )}
    </ContextMenu>
  );
};

export default React.memo(LibrarySubMenuButton);
