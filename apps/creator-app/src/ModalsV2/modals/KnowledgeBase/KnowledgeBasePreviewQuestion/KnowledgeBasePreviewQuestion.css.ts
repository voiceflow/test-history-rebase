import { style } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

export const popperStyles = style({
  width: '400px',
});

export const buttonStyles = style({
  width: '74px',
});

export const sourcesContentStyles = style({
  padding: '0 16px 0 24px',
  maxHeight: 'calc(100vh - 469.5px)',
  marginTop: '-4px',
  height: '100%',
});

export const sourcesContainerStyles = style({
  color: Tokens.colors.neutralDark.neutralsDark900,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

export const sourcesHeaderStyles = style({
  padding: '11px 16px 11px 24px',
});

export const sourcesTextAreaStyles = style({
  overflowWrap: 'break-word',
  selectors: {
    '&:first-line': {
      color: Tokens.colors.accent.accent500,
    },
  },
});

export const dividerStyles = style({
  padding: '0',
});

export const responseBoxStyles = style({
  display: 'flex',
  overflow: 'scroll',
  maxHeight: 'calc(100vh - (2 * 32px) - 240px - 16px)',
});

export const textareaStyles = style({
  overflowWrap: 'break-word',
});
