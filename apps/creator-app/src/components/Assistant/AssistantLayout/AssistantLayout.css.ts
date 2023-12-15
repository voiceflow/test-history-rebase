import { style } from '@voiceflow/style';

export const container = style({
  display: 'flex',
  width: '100%',
  height: '100%',
  overflow: ['hidden', 'clip'],
});

export const menu = style({
  flex: 1,
  overflow: ['hidden', 'clip'],
});

export const content = style({
  width: '100%',
  height: '100%',
  overflow: ['hidden', 'clip'],
});
