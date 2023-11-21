import { style } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

export const valueLabelStyles = style({
  color: Tokens.colors.neutralDark.neutralsDark100,
});

export const confirmBoxStyles = style({
  borderRadius: Tokens.border.radius[8],
  padding: '16px 20px 16px 20px',
  width: '238px',
  backgroundColor: Tokens.colors.white[100],
  boxShadow: Tokens.shadows.surfaceShadows.z16Light,
});
