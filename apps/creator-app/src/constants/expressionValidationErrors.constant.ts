export const UNEXPECTED_NUMBER = 'Unexpected number';
export const UNEXPECTED_STRING = 'Unexpected string';
export const UNEXPECTED_IDENTIFIER = 'Unexpected identifier';
export const UNEXPECTED_END_OF_INPUT = 'Unexpected end of input';
export const UNEXPECTED_TOKEN = 'Unexpected token';
export const INVALID_REGULAR_EXPRESSION = 'Invalid regular expression: missing /';
export const ILLEGAL_TOKEN = 'Unexpected token ILLEGAL';

export const ExpressionErrorMessages: Record<string, string> = {
  [UNEXPECTED_NUMBER]: 'A number is placed incorrectly in your text. Please check its placement.',
  [UNEXPECTED_END_OF_INPUT]: 'Your entry seems unfinished. Make sure all parts are complete.',
  [UNEXPECTED_STRING]:
    "There's an error in your text due to an unusual character or an incomplete part. Make sure all parts are complete.",
  [INVALID_REGULAR_EXPRESSION]: 'Your search pattern is incomplete. It should start and end with a slash (/).',
  [ILLEGAL_TOKEN]:
    "There's an error in your text due to an unusual character or an incomplete part. Make sure all parts are complete.",
};
