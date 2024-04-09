import { keyframes, recipe } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

const showKeyframes = keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(15px)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0%)',
  },
});

const hideKeyframes = keyframes({
  from: {
    opacity: 1,
    transform: 'translateY(0%)',
  },
  to: {
    opacity: 0,
    transform: 'translateY(-15px)',
  },
});

export const containerStyle = recipe({
  base: {
    position: 'fixed',
    right: 16,
    bottom: 16,
    zIndex: 1100,
    animation: `${showKeyframes} ${Tokens.animation.duration.fast} ${Tokens.animation.timingFunction.easeIn}`,
    animationFillMode: 'both',
  },

  variants: {
    closing: {
      true: {
        animationName: hideKeyframes,
      },
    },
  },
});
