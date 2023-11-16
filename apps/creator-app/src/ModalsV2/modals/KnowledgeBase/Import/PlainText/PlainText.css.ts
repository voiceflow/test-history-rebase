import { style } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

export const submitButtonStyles = style({
  width: 85,
});

export const labelStyles = style({
  color: Tokens.colors.neutralDark.neutralsDark100,
  marginBottom: 6,
});

export const textareaStyles = style({
  minHeight: '104px',
  width: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
  // TODO: will be replaced by a component that calculates this (DX-709)
  maxHeight: 'calc(100vh - (32px * 2) - 56px - 81px - 60px - 50px - 24px - 20px - 24px - 32px)',
});
