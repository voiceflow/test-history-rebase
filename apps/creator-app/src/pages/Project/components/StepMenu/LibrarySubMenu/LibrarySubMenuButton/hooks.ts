import { toast } from '@voiceflow/ui-next';

import * as CanvasTemplate from '@/ducks/canvasTemplate';
import * as CustomBlock from '@/ducks/customBlock';
import { useDispatch } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import { isCustomBlockData, LibraryStepType, TabData } from '../../constants';

const useCustomBlocksDropdown = (libraryType: LibraryStepType, tabData: TabData) => {
  const { name, id } = tabData;

  const deleteLibraryItemModal = ModalsV2.useModal(ModalsV2.Canvas.DeleteLibraryItem);
  const customBlocksEditorModal = ModalsV2.useModal(ModalsV2.Canvas.CustomBlocksEditor.EditModal);

  const removeCustomBlock = useDispatch(CustomBlock.remove);

  // Menu options for Custom Blocks
  const onEditCustomBlock = () => {
    if (isCustomBlockData(tabData, libraryType)) {
      customBlocksEditorModal.openVoid({
        blockID: id,
      });
    }
  };

  const onDeleteCustomBlock = () => {
    deleteLibraryItemModal.openVoid({
      entityName: name,
      entityType: 'Custom Block',
      onConfirm: async () => {
        try {
          await removeCustomBlock({ id });
          toast.success(`Custom block removed.`);
        } catch (err) {
          toast.error('Failed to remove custom block.');
        }
      },
    });
  };

  return {
    onEditCustomBlock,
    onDeleteCustomBlock,
  };
};

const useBlockTemplatesDropdown = (tabData: TabData) => {
  const { name, id } = tabData;

  const deleteLibraryItemModal = ModalsV2.useModal(ModalsV2.Canvas.DeleteLibraryItem);

  const deleteTemplate = useDispatch(CanvasTemplate.deleteCanvasTemplate);

  // Menu options for Block Templates
  const onEditBlockTemplate = null;

  const onDeleteBlockTemplate = () => {
    deleteLibraryItemModal.openVoid({
      entityName: name,
      entityType: 'Block Template',
      onConfirm: () => {
        deleteTemplate(id);
        toast.success(`Block template removed.`);
      },
    });
  };

  return {
    onEditBlockTemplate,
    onDeleteBlockTemplate,
  };
};

export const useContextDropdown = (libraryType: LibraryStepType, tabData: TabData) => {
  const { onEditCustomBlock, onDeleteCustomBlock } = useCustomBlocksDropdown(libraryType, tabData);

  const { onEditBlockTemplate, onDeleteBlockTemplate } = useBlockTemplatesDropdown(tabData);

  // Determine which context menu to use
  return libraryType === LibraryStepType.CUSTOM_BLOCK
    ? { onEdit: onEditCustomBlock, onDelete: onDeleteCustomBlock }
    : { onEdit: onEditBlockTemplate, onDelete: onDeleteBlockTemplate };
};
