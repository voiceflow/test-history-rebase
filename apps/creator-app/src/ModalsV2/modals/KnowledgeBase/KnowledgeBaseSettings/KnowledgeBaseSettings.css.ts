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
  color: Tokens.colors.neutralDark.neutralsDark900,
});

export const systemPromptStyles = style({
  // TODO: fix growing text area in modals DX-709
  maxHeight: 'calc(100vh - (32px * 2) - 56px - 81px - 81px - 81px - 81px - 84px - 36px - 36px)',
  overflowY: 'scroll',
});
