import { recipe } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

export const label = recipe({
  variants: {
    active: {
      false: {
        color: Tokens.colors.neutralDark.neutralsDark100,
      },
    },
  },
});
