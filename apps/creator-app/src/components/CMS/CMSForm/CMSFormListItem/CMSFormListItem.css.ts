import { keyframes, recipe, style } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

const inKeyframe = keyframes({
  '0%': {
    opacity: 0,
    display: 'block',
  },

  '100%': {
    opacity: 1,
    display: 'block',
  },
});

const outKeyframe = keyframes({
  '0%': {
    opacity: 1,
    display: 'block',
  },

  '99%': {
    opacity: 0,
    display: 'block',
  },

  '100%': {
    opacity: 0,
    display: 'none',
  },
});

export const containerStyle = style({});

export const buttonStyle = recipe({
  variants: {
    state: {
      in: {
        animation: `${inKeyframe} ${Tokens.animation.duration.default} ${Tokens.animation.timingFunction.default}`,
        animationFillMode: 'backwards',
      },
      out: {
        animation: `${outKeyframe} ${Tokens.animation.duration.default} ${Tokens.animation.timingFunction.default}`,
        animationFillMode: 'forwards',
      },
    },
    showOnHover: {
      true: {
        selectors: {
          [`${containerStyle}:not(:hover) &`]: {
            display: 'none',
            animation: `${outKeyframe} ${Tokens.animation.duration.default} ${Tokens.animation.timingFunction.default}`,
            animationFillMode: 'forwards',
          },
          [`${containerStyle}:hover &`]: {
            animation: `${inKeyframe} ${Tokens.animation.duration.default} ${Tokens.animation.timingFunction.default}`,
            animationFillMode: 'backwards',
          },
        },
      },
    },
  },
});
