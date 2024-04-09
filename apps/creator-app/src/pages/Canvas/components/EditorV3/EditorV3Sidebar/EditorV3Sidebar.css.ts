import { recipe } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

export const drawerStyle = recipe({
  base: {
    transition: Tokens.transition(['right']),
  },

  variants: {
    newLayout: {
      true: {
        top: 56,
        height: `calc(100% - 56px)`,
      },
    },
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
