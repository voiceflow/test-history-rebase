import { style } from '@voiceflow/style';

export const submitButtonStyles = style({
  width: 85,
});

export const textareaStyles = style({
  minHeight: '104px',
  width: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
  // TODO: will be replaced by a component that calculates this (DX-709)
  maxHeight: 'calc(100vh - (32px * 2) - 56px - 24px - 20px - 80px - 24px )',
});
