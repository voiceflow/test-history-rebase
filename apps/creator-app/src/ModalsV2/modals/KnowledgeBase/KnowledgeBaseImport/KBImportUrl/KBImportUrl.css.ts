import { style } from '@voiceflow/style';

export const textareaStyles = style({
  minHeight: '60px',
  width: '100%',
  overflowY: 'auto',
  overflowX: 'auto',
  // TODO: fix growing text area in modals DX-709
  maxHeight: 'calc(100vh - (32px * 2) - 56px - 44px - 24px - 80px - 24px - 84px - 16px)',
});

export const errorTextStyles = style({
  overflowWrap: 'break-word',
});
