import { recipe, style } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

export const editorButtonStyle = recipe({
  base: {
    cursor: 'pointer',
  },

  variants: {
    isDragging: {
      true: {
        cursor: 'grabbing !important',

        '&:hover': {
          backgroundColor: '#fff !important',
        },
        '&:active': {
          backgroundColor: '#fff !important',
        },
      },
    },
  },
});

export const savingEntityCapture = style({
  color: Tokens.colors.neutralDark.neutralsDark50,
  whiteSpace: 'nowrap',
});
