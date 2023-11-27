import { recipe } from '@voiceflow/style';

export const entityStyles = recipe({
  base: { alignSelf: 'end' },
  variants: {
    isVisible: {
      false: { visibility: 'hidden' },
    },
  },
});
