import { recipe, style } from '@voiceflow/style';

export const modalContainerRecipe = recipe({
  base: {
    marginTop: '0 !important',
  },

  variants: {
    isResponseModalOpen: {
      true: {
        selectors: {
          '& + &': {
            marginTop: '16px !important',
          },
        },
      },
      false: {
        maxHeight: 'calc(100vh - 64px)',
      },
    },
  },
});

export const modalParentContainer = style({
  width: '100%',
  height: '100%',
  overflow: 'scroll',
});
