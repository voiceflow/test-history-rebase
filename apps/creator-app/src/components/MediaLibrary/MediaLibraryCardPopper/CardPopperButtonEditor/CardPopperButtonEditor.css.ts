import type { StyleRule } from '@voiceflow/style';
import { recipe, style, styleVariants } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

const activeStyle: StyleRule = {
  backgroundColor: Tokens.colors.accent.accent500,

  selectors: {
    '&:hover': {
      backgroundColor: Tokens.colors.accent.accent500,
    },
  },
};

export const activeContainerStyles = styleVariants({
  true: activeStyle,
  false: {
    backgroundColor: 'unset',

    selectors: {
      '&:hover': {
        backgroundColor: Tokens.colors.neutralDark.neutralsDark900_6,
      },
    },
  },
});

export const baseContainerStyles = style({
  height: 32,
  transition: Tokens.transition(['background-color']),
  border: 'unset',
  fontSize: 14,
  textAlign: 'unset',
  cursor: 'pointer',
  userSelect: 'none',
  display: 'flex',
  flexGrow: 1,
  gap: 12,
  alignItems: 'center',
  padding: '6px 12px',
  borderRadius: Tokens.border.radius[7],
  overflow: 'hidden',
});

export const containerStyles = recipe({
  base: baseContainerStyles,

  variants: {
    active: activeContainerStyles,
    disabled: {
      true: {
        cursor: 'not-allowed',
      },
      false: {
        selectors: {
          '&:active': activeStyle,
        },
      },
    },
  },
});
