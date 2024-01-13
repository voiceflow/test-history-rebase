import { recipe } from '@voiceflow/style';

export const modalContainerRecipe = recipe({
  variants: {
    isSecondModalOpen: {
      true: {
        maxHeight: 'none',
      },
      false: {
        maxHeight: 'calc(100vh - 64px)',
      },
    },
  },
});
