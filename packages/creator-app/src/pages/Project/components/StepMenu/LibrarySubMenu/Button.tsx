import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, ContextMenu, OptionsMenuOption, toast, usePersistFunction } from '@voiceflow/ui';
import React from 'react';
import { DismissableLayerContext } from 'react-dismissable-layers';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { BlockType, DragItem } from '@/constants';
import { AutoPanningCacheContext } from '@/contexts';
import * as CanvasTemplate from '@/ducks/canvasTemplate';
import { useDispatch, useEnableDisable, useEventualEngine, useSetup, useTeardown } from '@/hooks';
import TemplateEditorPopper from '@/pages/Canvas/components/TemplateEditor/Popper';
import { ClassName } from '@/styles/constants';

import ClickNoDragTooltip from '../ClickNoDragTooltip';
import { LibraryDragItem } from '../constants';
import * as S from '../SubMenu/styles';
import { SubMenuButtonContainer } from '../SubMenu/SubMenuButton/styles';
import { Label } from './styles';

interface SubMenuButtonProps {
  name: string;
  id: string;
  color: string | null;
  nodeIDs: string[];
  onDrop: VoidFunction;
  isDraggingPreview?: boolean;
}

const canMergeIntoOtherBlocks = (nodes: Realtime.Node[]) => nodes?.length === 1;

const LibrarySubMenuButton: React.FC<SubMenuButtonProps> = ({ name, id, color, nodeIDs, onDrop, isDraggingPreview }) => {
  const isAutoPanning = React.useContext(AutoPanningCacheContext);
  const [isEditing, setEditing] = React.useState(false);
  const [isClicked, enableClicked, clearClicked] = useEnableDisable();
  const deleteTemplate = useDispatch(CanvasTemplate.deleteCanvasTemplate);
  const updateTemplate = useDispatch(CanvasTemplate.updateCanvasTemplate);
  const { dismissAllGlobally } = React.useContext(DismissableLayerContext);

  const [values, setValues] = React.useState({ name, color });

  const getEngine = useEventualEngine();

  const [{ isDragging }, connectDrag, connectPreview] = useDrag<LibraryDragItem, unknown, { isDragging: boolean }>({
    item: { type: DragItem.TEMPLATES, name, id, color, nodeIDs },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),

    begin: () => {
      const engine = getEngine();
      if (!engine) return;
      engine.drag.setDraggingToCreate(true);

      const nodes = engine.select(CanvasTemplate.nodesByIDsSelector, { ids: nodeIDs });
      if (!canMergeIntoOtherBlocks(nodes)) return;

      const [node] = nodes;

      const steps = engine.select(CanvasTemplate.nodesDataByIDsSelector, { ids: node.combinedNodes });

      engine.merge.setVirtualSource(BlockType.COMBINED, node, { nodes: steps, meta: { templateID: id } });
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
    if (isDragging) clearClicked();
  }, [isDragging]);

  const handleSubmit = usePersistFunction(async ({ name, color }) => {
    await updateTemplate(id, { name, color });
    dismissAllGlobally();
  });

  const onNameChange = usePersistFunction((newName: string) => {
    setValues({ ...values, name: newName });
  });

  const onColorChange = usePersistFunction((newColor: string) => {
    setValues({ ...values, color: newColor });
  });

  const onSubmenuButtonMouseDown = usePersistFunction((event: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditing && event.button !== 2) enableClicked();
  });

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

  return (
    <ContextMenu options={menuOptions} selfDismiss>
      {({ isOpen, onContextMenu }) => (
        <TemplateEditorPopper
          onClose={() => setEditing(false)}
          isOpen={isEditing && !isDragging}
          nodeIDs={nodeIDs}
          editing={isEditing}
          placement="right-start"
          modifiers={{ offset: { offset: '-12,0' } }}
          onColorChange={onColorChange}
          onNameChange={onNameChange}
          color={values.color}
          name={values.name}
          onSubmit={handleSubmit}
        >
          {() => (
            <ClickNoDragTooltip>
              {() => (
                <SubMenuButtonContainer
                  ref={connectDrag}
                  isClicked={isClicked && !isEditing}
                  onMouseUp={clearClicked}
                  onMouseDown={onSubmenuButtonMouseDown}
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
              )}
            </ClickNoDragTooltip>
          )}
        </TemplateEditorPopper>
      )}
    </ContextMenu>
  );
};

export default React.memo(LibrarySubMenuButton);
