import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, ContextMenu, OptionsMenuOption, usePersistFunction } from '@voiceflow/ui';
import React from 'react';
import { DismissableLayerContext } from 'react-dismissable-layers';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { BlockType, DragItem } from '@/constants';
import { AutoPanningCacheContext } from '@/contexts/AutoPanningContext';
import * as CanvasTemplate from '@/ducks/canvasTemplate';
import { useDispatch, useEnableDisable, useEventualEngine } from '@/hooks';
import TemplateEditorPopper from '@/pages/Canvas/components/TemplateEditor/Popper';
import { ClassName } from '@/styles/constants';
import { pointerNodeDataFactory } from '@/utils/customBlock';

import ClickNoDragTooltip from '../../ClickNoDragTooltip';
import { isCustomBlockData, LibraryDragItem, LibraryStepType, TabData } from '../../constants';
import * as S from '../../SubMenu/styles';
import { SubMenuButtonContainer } from '../../SubMenu/SubMenuButton/styles';
import { Label } from './components';
import { useContextDropdown } from './hooks';

interface SubMenuButtonProps {
  label: string;
  type: LibraryStepType;
  tabData: TabData;
  isDraggingPreview?: boolean;
  popperContent?: (props: { isEditing: boolean }) => React.ReactNode;

  onDrop: VoidFunction;
  onEdit?: VoidFunction | null;
  onDelete: VoidFunction;
}

const canMergeIntoOtherBlocks = (nodes: Realtime.Node[]) => nodes?.length === 1;

const useDragState = ({ tabData, type, onDrop }: Pick<SubMenuButtonProps, 'tabData' | 'type' | 'onDrop'>) => {
  const isAutoPanning = React.useContext(AutoPanningCacheContext);

  const getEngine = useEventualEngine();

  const [{ isDragging }, connectDrag, connectPreview] = useDrag<LibraryDragItem, unknown, { isDragging: boolean }>({
    type: DragItem.LIBRARY,

    item: () => {
      const engine = getEngine();

      engine?.drag.setDraggingToCreate(true);

      if (engine && type === LibraryStepType.BLOCK_TEMPLATES) {
        const canvasTemplateData = tabData as any; /* $TODO - Get rid of this any */
        const nodes = engine.select(CanvasTemplate.nodesByIDsSelector, { ids: canvasTemplateData.nodeIDs });

        if (canMergeIntoOtherBlocks(nodes)) {
          const [node] = nodes;

          const steps = engine.select(CanvasTemplate.nodesDataByIDsSelector, { ids: node.combinedNodes });

          engine.merge.setVirtualSource(BlockType.COMBINED, node, { nodes: steps, meta: { templateID: tabData.id } });
        }
      } else if (engine && type === LibraryStepType.CUSTOM_BLOCK && isCustomBlockData(tabData, type)) {
        engine.merge.setVirtualSource(BlockType.CUSTOM_BLOCK_POINTER, pointerNodeDataFactory(tabData));
      }

      return { type: DragItem.LIBRARY, libraryType: type, tabData };
    },

    collect: (monitor) => ({ isDragging: monitor.isDragging() }),

    end: () => {
      onDrop();
      isAutoPanning.current = false;

      getEngine()?.merge.reset();
      getEngine()?.drag.setDraggingToCreate(false);
    },
  });

  React.useEffect(() => {
    connectPreview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return {
    isDragging,
    connectDrag,
  };
};

const useClickState = (isEditing: boolean, isDragging: boolean) => {
  const [isClicked, enableClicked, clearClicked] = useEnableDisable();

  const onSubmenuButtonMouseDown = usePersistFunction((event: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditing && event.button !== 2) enableClicked();
  });

  React.useEffect(() => {
    if (isDragging) clearClicked();
  }, [isDragging]);

  return {
    isClicked,
    clearClicked,
    onSubmenuButtonMouseDown,
  };
};

const useIntrinsicState = (props: Pick<SubMenuButtonProps, 'tabData' | 'type' | 'onDrop'>) => {
  const dragAPI = useDragState(props);
  const [isEditing, setEditing] = React.useState(false);
  const clickAPI = useClickState(isEditing, dragAPI.isDragging);
  return {
    dragAPI,
    clickAPI,
    editAPI: {
      isEditing,
      setEditing,
    },
  };
};

const LibrarySubMenuButton: React.FC<SubMenuButtonProps> = ({ label, type, tabData, onDrop, onEdit, onDelete, isDraggingPreview }) => {
  const {
    dragAPI: { isDragging, connectDrag },
    clickAPI: { isClicked, clearClicked, onSubmenuButtonMouseDown },
    editAPI: { isEditing, setEditing },
  } = useIntrinsicState({ tabData, type, onDrop });

  // Dropdown menu
  const defaultEditFunction = () => {
    setEditing(true);
  };

  const menuOptions: OptionsMenuOption[] = React.useMemo(
    () => [
      {
        label: <S.ContextMenuOption>Edit</S.ContextMenuOption>,
        onClick: onEdit || defaultEditFunction,
      },
      {
        label: <S.ContextMenuOption>Delete</S.ContextMenuOption>,
        onClick: onDelete,
      },
    ],
    [onEdit, onDelete]
  );

  /// /////////// Specific logic
  const updateTemplate = useDispatch(CanvasTemplate.updateCanvasTemplate);

  const { dismissAllGlobally } = React.useContext(DismissableLayerContext);
  const handleSubmit = usePersistFunction(async ({ name, color }) => {
    await updateTemplate(tabData.id, { name, color });
    dismissAllGlobally();
  });

  const [values, setValues] = React.useState({ name: tabData.name, color: (tabData as any).color });

  const onNameChange = usePersistFunction((newName: string) => {
    setValues({ ...values, name: newName });
  });

  const onColorChange = usePersistFunction((newColor: string) => {
    setValues({ ...values, color: newColor });
  });

  return (
    <ContextMenu options={menuOptions} selfDismiss>
      {({ isOpen, onContextMenu }) => (
        /**
         * $TODO$ - Should refactor the `TemplateEditorPopper` outside of this `LibrarySubMenuButton` component
         * because this popper is specific to block templates, but custom blocks also uses `LibrarySubMenuButton`
         */
        <TemplateEditorPopper
          onClose={() => setEditing(false)}
          isOpen={isEditing && !isDragging}
          nodeIDs={(tabData as any).nodeIDs}
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
                    <Label>{label}</Label>
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

type ConnectedSubMenuButtonProps = Omit<SubMenuButtonProps, 'onEdit' | 'onDelete'> & {
  type: LibraryStepType;
};

const ConnectedLibrarySubMenuButton: React.FC<ConnectedSubMenuButtonProps> = (props) => {
  const { type, tabData } = props;
  const { onEdit, onDelete } = useContextDropdown(type, tabData);
  return <LibrarySubMenuButton {...props} onEdit={onEdit} onDelete={onDelete} />;
};

export default React.memo(ConnectedLibrarySubMenuButton);
