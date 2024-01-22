import { style } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

export const popperStyles = style({
  backgroundColor: Tokens.colors.white[100],
  borderRadius: Tokens.border.radius[10],
  boxShadow: Tokens.shadows.surfaceShadows.z16Light,
});

export const textareaStyles = style({
  minHeight: '36px',
});
