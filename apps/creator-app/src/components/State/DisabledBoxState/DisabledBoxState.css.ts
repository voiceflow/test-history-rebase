import { recipe } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

export const boxStyle = recipe({
  base: {
    transition: `opacity ${Tokens.animation.duration.default} ${Tokens.animation.timingFunction.default}`,
  },

  variants: {
    disabled: {
      true: {
        opacity: 0.65,
      },
    },
  },
});
