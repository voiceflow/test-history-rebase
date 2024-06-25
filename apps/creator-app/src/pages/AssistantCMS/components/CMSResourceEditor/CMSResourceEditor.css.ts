import { globalStyle, style } from '@voiceflow/style';

export const container = style({
  width: '100%',
  height: '100%',
  flex: 1,
  overflow: ['hidden', 'clip'],
});

export const content = style({
  position: 'absolute',
  top: 112,
  right: 0,
  bottom: 0,
});

export const drawer = style({
  maxHeight: '100%',
});

globalStyle(`${drawer} > div`, {
  height: 'unset',
});
