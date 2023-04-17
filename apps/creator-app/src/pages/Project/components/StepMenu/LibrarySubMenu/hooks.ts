import * as ModalsV2 from '@/ModalsV2';

export const useCustomBlockCreatorModal = () => {
  const customBlocksEditorModal = ModalsV2.useModal(ModalsV2.Canvas.CustomBlocksEditor.CreationModal);

  const openCustomBlocksCreatorModal = () => customBlocksEditorModal.openVoid({});

  return {
    openCustomBlocksCreatorModal,
  };
};
