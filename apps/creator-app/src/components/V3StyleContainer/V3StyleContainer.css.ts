import { style } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

export const v3GlobalOverrides = style({
  fontWeight: 'inherit',
  fontSize: '16px',
  background: 'white',
  color: Tokens.colors.neutralDark.neutralsDark900,
  fontFamily: Tokens.typography.family.regular,
  MozOsxFontSmoothing: 'grayscale',
  WebkitFontSmoothing: 'antialiased',
  width: '100%',
  height: '100%',
  display: 'flex',
});
