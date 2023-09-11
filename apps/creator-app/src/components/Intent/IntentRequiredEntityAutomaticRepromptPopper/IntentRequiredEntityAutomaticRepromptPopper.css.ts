import { recipe } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

export const editorButtonDropdownRecipe = recipe({
  base: {
    cursor: 'pointer',
  },

  variants: {
    isActive: {
      true: {
        paddingLeft: '10px',
        background: 'white !important',
        color: 'black !important',
        border: `2px solid ${Tokens.colors.accent.accent500}`,
      },
      false: {
        border: '2px solid transparent',
      },
    },
  },
});
