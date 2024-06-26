import { recipe } from '@voiceflow/style';

export const editorButtonStyle = recipe({
  base: {
    cursor: 'pointer',
    textAlign: 'start',
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
