import { recipe, style } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

export const containerStyle = recipe({
  base: {
    position: 'absolute',
    zIndex: 20,
    left: 0,
    bottom: 0,
    transitionProperty: 'top',
    transitionDuration: Tokens.animation.duration.default,
    transitionTimingFunction: Tokens.animation.timingFunction.default,
  },
  variants: {
    canvasOnly: {
      true: {
        top: 0,
      },
      false: {
        top: 56,
      },
    },
  },
});

export const toolbarStyle = style({
  position: 'absolute',
  left: 'calc(100% + 8px)',
  bottom: 8,
});
