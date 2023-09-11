import type { StyleRule } from '@voiceflow/style';
import { recipe, style, styleVariants } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

export const container = style({
  position: 'relative',
  padding: 0,
});

const activeStyle: StyleRule = {
  color: Tokens.colors.white[100],
  boxShadow: '0px -1px 0px 0px #191D22 inset, inset -1px 0px 0px rgba(25, 29, 34, 0.32)',
  backgroundColor: Tokens.colors.neutralDark.neutralsDark600,
};

export const baseButton = style({
  color: Tokens.colors.neutralLight.neutralsLight200,
  padding: 16,
  fontSize: 24,

  ':hover': {
    color: Tokens.colors.neutralLight.neutralsLight100,
    boxShadow: '0px -1px 0px 0px #191D22 inset, inset -1px 0px 0px rgba(25, 29, 34, 0.32)',
  },

  ':active': activeStyle,
});

const buttonActiveVariants = styleVariants({
  true: {
    ...activeStyle,

    ':hover': activeStyle,
  },
});

export const button = recipe({
  base: baseButton,

  variants: {
    isActive: buttonActiveVariants,
  },
});

export const nubIcon = style({
  color: Tokens.colors.neutralLight.neutralsLight900,
  rotate: '-45deg',
  position: 'absolute',
  right: 2,
  bottom: 2,
  fontSize: '24px',
  pointerEvents: 'none',
  transition: Tokens.transition(['color', 'translate']),

  selectors: {
    [`${baseButton}:not(${buttonActiveVariants.true}):not(:active):hover + &`]: {
      translate: '2px 2px',
      color: Tokens.colors.neutralLight.neutralsLight700,
    },

    [`${baseButton}:active + &`]: {
      translate: '2px 2px',
      color: Tokens.colors.neutralLight.neutralsLight500,
    },

    [`${buttonActiveVariants.true} + &`]: {
      translate: '2px 2px',
      color: Tokens.colors.neutralLight.neutralsLight500,
    },
  },
});
