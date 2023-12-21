import { style } from '@voiceflow/style';

export const sectionBox = style({
  maxHeight: 'calc(100% - 24px)',
  display: 'block',
});

export const contentStyles = style({
  padding: '0 24px 0 24px',
  marginTop: '-4px',
  maxHeight: 'calc(100vh - 223.5px)',
  overflowY: 'scroll',
});

export const headerStyles = style({
  padding: '11px 16px 11px 24px',
});
