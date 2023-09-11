import { recipe, style } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

export const inputStyle = recipe({
  base: {
    selectors: {
      '&:focus': {
        boxShadow: `inset ${Tokens.components.inputTokens.shadows.focus}`,
      },
    },
  },

  variants: {
    filled: {
      true: {
        ...Tokens.components.inputTokens.borders.active,
        borderRadius: `${Tokens.border.radius[8]} ${Tokens.border.radius[8]} 0 0`,
        boxShadow: `inset ${Tokens.components.inputTokens.shadows.focus}`,
      },
    },
  },
});

export const buttonStyle = style({
  borderRadius: `0 0 ${Tokens.border.radius[8]} ${Tokens.border.radius[8]}`,
  top: '-2px',
  position: 'relative',
});
