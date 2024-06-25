import { recipe } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

export const drawerStyle = recipe({
  base: {
    top: 0,
    height: '100%',
    transition: Tokens.transition(['right', 'top', 'height']),
  },

  variants: {
    withHeader: {
      true: {
        top: 56,
        height: 'calc(100% - 56px)',
      },
    },
  },
});
