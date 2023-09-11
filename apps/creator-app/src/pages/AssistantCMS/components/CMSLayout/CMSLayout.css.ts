import { style } from '@voiceflow/style';

export const container = style({
  display: 'flex',
  width: '100%',
  height: '100%',
  overflow: ['hidden', 'clip'],
});

export const sidebar = style({
  display: 'flex',
  height: '100%',
  zIndex: 10,
  flexDirection: 'column',
});

export const menu = style({
  flex: 1,
  overflow: ['hidden', 'clip'],
});

export const content = style({
  display: 'flex',
  width: '100%',
  height: '100%',
  overflow: ['hidden', 'clip'],
  flexDirection: 'column',
});
