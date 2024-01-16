import { recipe, style } from '@voiceflow/style';
import { Theme } from '@voiceflow/ui-next/styles';

export const testResults = style({
  color: Theme.vars.color.font.default,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

export const fullWidthStyle = style({ width: '100%', background: 'white', zIndex: 10 });

export const jsonEditorStyles = style({
  minHeight: '90px',
  marginTop: '-4px',
});

export const jsonCollapsibleStyles = style({
  padding: 0,
  overflowY: 'auto',
});

export const mapperStyles = style({
  paddingBottom: 14,
});

export const outputVarsStyles = style({});

export const sectionRecipe = recipe({
  base: {
    overflowY: 'scroll',
  },

  variants: {
    disabled: { true: { opacity: 0.65, cursor: 'not-allowed' } },
  },
});

export const rhsMapperStyles = style({
  paddingLeft: 5,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  // this limits block line count to 4 lines
  WebkitLineClamp: 4,
  maxHeight: 80,
});

export const footerStyles = style({
  zIndex: 0,
  background: 'white',
});
