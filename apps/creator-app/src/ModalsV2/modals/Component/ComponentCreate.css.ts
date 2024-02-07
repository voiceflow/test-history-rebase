import { style } from '@voiceflow/style';

export const textareaStyles = style({
  minHeight: '96px',
  width: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
  // TODO: will be replaced by a component that calculates this (DX-709)
  maxHeight: 'calc(100vh - 345px)',
});
