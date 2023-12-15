import { style } from '@voiceflow/style';

export const submitButtonStyles = style({
  minWidth: 85,
  width: '100%',
});

export const labelStyles = style({
  color: '#656D75',
  marginBottom: 6,
});

export const textareaStyles = style({
  minHeight: '60px',
  width: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
  // TODO: fix growing text area in modals DX-709
  maxHeight: 'calc(100vh - (32px * 2) - 56px - 81px - 60px - 50px - 24px - 20px - 24px - 32px)',
});
