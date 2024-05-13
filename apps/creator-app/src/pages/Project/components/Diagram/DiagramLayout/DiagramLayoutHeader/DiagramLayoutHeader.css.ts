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
    transitionDuration: Tokens.animation.duration.default,
    transitionTimingFunction: Tokens.animation.timingFunction.default,
    paddingLeft: 8,
    paddingRight: 8,
    // this is a hack to fix the header blur when diagram blur loader is shown
    opacity: 0.9999999,
  },

  variants: {
    canvasOnly: {
      true: {
        transform: 'translateY(-100%)',
      },
    },
  },
});
