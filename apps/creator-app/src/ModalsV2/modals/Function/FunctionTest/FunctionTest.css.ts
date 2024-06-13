import { recipe, style } from '@voiceflow/style';

export const formContentStyle = recipe({
  base: {
    minHeight: 196,
  },
  variants: {
    hasVariables: {
      true: {
        minHeight: 240,
      },
    },
    hasManyVariables: {
      true: {
        minHeight: 316,
      },
    },
  },
});

export const resultContentStyle = style({
  flexShrink: 0,
});
