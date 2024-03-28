import { keyframes, recipe } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

const hideKeyframes = keyframes({
  from: {
    opacity: 1,
  },
  to: {
    opacity: 0,
  },
});

const hideGoodKeyframes = keyframes({
  from: {
    width: '40px',
    opacity: 1,
  },
  to: {
    width: 0,
    opacity: 0,
    paddingLeft: 0,
  },
});

export const buttonContainerStyle = recipe({
  base: {
    animationFillMode: 'both',
    animationDuration: Tokens.animation.duration.default,
    animationTimingFunction: Tokens.animation.timingFunction.easeOut,
  },

  variants: {
    type: { bad: {}, good: {} },

    voted: {
      true: {
        pointerEvents: 'none',
      },
    },

    voteDestination: {
      true: {
        animationDelay: '2s',
      },
    },
  },

  compoundVariants: [
    {
      variants: { voted: true, type: 'good', voteDestination: true },
      style: {
        animationName: hideKeyframes,
      },
    },
    {
      variants: { voted: true, type: 'good', voteDestination: false },
      style: {
        animationName: hideGoodKeyframes,
      },
    },
    {
      variants: { voted: true, type: 'bad' },
      style: {
        animationName: hideKeyframes,
      },
    },
  ],
});

export const buttonIconStyle = recipe({
  variants: {
    type: { bad: {}, good: {} },
    voted: { true: {} },
  },
  compoundVariants: [
    {
      variants: { voted: true, type: 'good' },
      style: {
        color: Tokens.colors.success.success600,
      },
    },
    {
      variants: { voted: true, type: 'bad' },
      style: {
        color: Tokens.colors.alert.alert700,
      },
    },
  ],
});
