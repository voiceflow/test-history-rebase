import type { JSColorStyle } from './types';

export enum PreviewColors {
  // background
  GREY_BACKGROUND_COLOR = '#33373a',
  GREY_DARK_BACKGROUND_COLOR = '#2b2f32',
  GREY_LIGHT_BACKGROUND_COLOR = '#4b5052',
  GREY_HOVER_BACKGROUND_COLOR = '#5d6264',

  // text
  GREY_TEXT_COLOR = '#f2f7f7',
  GREY_TITLE_COLOR = '#c0c5c6',

  // code
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  CODE_COLOR = '#f2f7f7',
  SYNTAX_COLOR = '#70a9c2',
  STRING_COLOR = '#e4a398',
  TOKEN_COLOR = '#659ffd',
}

export const CodeColorStyle: JSColorStyle = {
  backgroundColor: PreviewColors.GREY_DARK_BACKGROUND_COLOR,
  defaultColor: PreviewColors.CODE_COLOR,
  statements: PreviewColors.SYNTAX_COLOR,
  strings: PreviewColors.STRING_COLOR,
  variableToken: PreviewColors.TOKEN_COLOR,
};
