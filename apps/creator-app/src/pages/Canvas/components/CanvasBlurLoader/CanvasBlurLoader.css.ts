import { recipe } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

export const container = recipe({
  base: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    backdropFilter: 'blur(2px)',
    opacity: 0,
    pointerEvents: 'none',
    transitionProperty: 'opacity',
    transitionDuration: Tokens.animation.duration.default,
    transitionTimingFunction: Tokens.animation.timingFunction.default,
  },

  variants: {
    status: {
      entering: {
        opacity: 1,
        pointerEvents: 'all',
      },
      entered: {
        opacity: 1,
        pointerEvents: 'all',
      },
      exited: {
        opacity: 0,
        pointerEvents: 'none',
      },
      exiting: {
        opacity: 0,
        pointerEvents: 'none',
      },
      unmounted: {},
    },
  },
});
