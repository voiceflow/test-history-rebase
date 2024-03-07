import { style } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

export const valueLabelStyles = style({
  color: Tokens.colors.neutralDark.neutralsDark100,
});

export const systemPromptStyles = style({
  // TODO: fix growing text area in modals DX-709
  maxHeight: 'calc(100vh - (32px * 2) - 56px - 81px - 81px - 81px - 81px - 84px - 36px - 36px)',
  overflowY: 'scroll',
});
