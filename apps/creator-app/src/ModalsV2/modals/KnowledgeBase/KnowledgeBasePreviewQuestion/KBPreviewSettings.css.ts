import { style } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

export const popperStyles = style({
  backgroundColor: Tokens.colors.white[100],
  borderRadius: Tokens.border.radius[10],
  boxShadow: Tokens.shadows.surfaceShadows.z16Light,
});

export const textareaStyles = style({
  // TODO: fix growing text area in modals DX-709
  maxHeight: 'calc(100vh - (32px * 2) - 41px - 84px - 81px - 81px - 36px - 24px)',
});
