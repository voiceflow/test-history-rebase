import { recipe, style } from '@voiceflow/style';
import { Theme } from '@voiceflow/ui-next/styles';

export const testResults = style({
  color: Theme.vars.color.font.default,
});

export const jsonEditorStyles = style({
  marginTop: '4px',
});

export const jsonCollapsibleStyles = style({
  padding: 0,
  marginLeft: '-4px',
  maxHeight: '140px',
  overflowY: 'auto',
  overflowX: 'hidden',
});

export const mapperStyles = style({
  paddingBottom: 16,
});

export const sectionRecipe = recipe({
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
  // this  limits block line count to 4 lines
  WebkitLineClamp: 4,
  maxHeight: 80,
  paddingBottom: 16,
});
