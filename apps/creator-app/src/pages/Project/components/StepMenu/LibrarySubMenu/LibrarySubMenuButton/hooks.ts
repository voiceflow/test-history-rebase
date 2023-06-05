import { toast } from '@voiceflow/ui';

import * as CanvasTemplate from '@/ducks/canvasTemplate';
import { useDispatch } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import { LibraryStepType, TabData } from '../../constants';

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

export const useContextDropdown = (_libraryType: LibraryStepType, tabData: TabData) => {
  const { onEditBlockTemplate, onDeleteBlockTemplate } = useBlockTemplatesDropdown(tabData);

  // Determine which context menu to use
  return { onEdit: onEditBlockTemplate, onDelete: onDeleteBlockTemplate };
};
