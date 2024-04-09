import { recipe } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

export const headerStyle = recipe({
  base: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    transitionProperty: 'transform',
    transitionDuration: Tokens.animation.duration.fast,
    transitionTimingFunction: Tokens.animation.timingFunction.easeOut,
  },

  variants: {
    canvasOnly: {
      true: {
        transitionTimingFunction: Tokens.animation.timingFunction.easeIn,
        transform: 'translateY(-100%)',
      },
    },
  },
});
