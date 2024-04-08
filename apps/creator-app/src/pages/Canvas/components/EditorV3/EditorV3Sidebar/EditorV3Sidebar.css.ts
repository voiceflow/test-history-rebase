import { recipe } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

export const drawerStyle = recipe({
  base: {
    transition: Tokens.transition(['right']),
  },

  variants: {
    isOpen: {
      true: {
        right: '0px',
      },
      false: {
        right: '-350px !important',
      },
    },
  },
});
