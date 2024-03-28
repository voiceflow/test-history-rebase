import { recipe } from '@voiceflow/style';

export const footerStyle = recipe({
  base: {
    zIndex: 0,
    background: 'white',
  },

  variants: {
    disabled: {
      true: {
        opacity: 0.65,
        cursor: 'not-allowed',
      },
    },
  },
});
