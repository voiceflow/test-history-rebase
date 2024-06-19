import { style } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

export const variableContainer = style({
  display: 'flex',
  height: '20px',
  padding: '0 4px',
  gap: '4px',
});

export const setText = style({
  display: 'inline',
  color: Tokens.colors.neutralDark.neutralsDark100,
});

export const expressionOverflow = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
});
