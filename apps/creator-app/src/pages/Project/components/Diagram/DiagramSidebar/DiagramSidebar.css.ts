import { recipe, style } from '@voiceflow/style';

export const containerStyle = recipe({
  base: {
    position: 'absolute',
    zIndex: 20,
    left: 0,
    bottom: 0,
  },
  variants: {
    canvasOnly: {
      true: {
        top: 0,
      },
      false: {
        top: 56,
      },
    },
  },
});

export const topHeaderSectionStyle = style({
  borderTopRightRadius: '10px',
});

export const bottomHeaderSectionStyle = style({
  borderBottomRightRadius: '10px',
});

export const toolbarStyle = style({
  position: 'absolute',
  left: 'calc(100% + 8px)',
  bottom: 8,
});
