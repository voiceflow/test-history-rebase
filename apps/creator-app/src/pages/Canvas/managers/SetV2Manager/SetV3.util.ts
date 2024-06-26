import type { Variable } from '@voiceflow/dtos';

export const EXPRESSION_VARIABLE_TEXT_REGEXP = /{{\[(\w*)]\.(\w*)}}/g;

export const expressionToString = (
  expression: string,
  variablesMapByName: Partial<Record<string, Variable>>
): string => {
  const matches = [...expression.matchAll(EXPRESSION_VARIABLE_TEXT_REGEXP)];
  if (!matches.length) return expression;

  let stringExpression = '';
  let prevMatch: RegExpMatchArray | null = null;

  for (const match of matches) {
    const variable = variablesMapByName[match[1]];

    let substring: string;

    if (!prevMatch) {
      substring = expression.substring(0, match.index);
    } else {
      substring = expression.substring(prevMatch.index! + prevMatch[0].length, match.index);
    }

    if (substring) {
      stringExpression += substring;
    }

    if (variable) {
      stringExpression += `{ ${variable.name} }`;
    } else {
      stringExpression += match[0];
    }

    prevMatch = match;
  }

  if (!prevMatch) return stringExpression;

  const substring = expression.substring(prevMatch.index! + prevMatch[0].length, expression.length);
  stringExpression += substring;

  return stringExpression;
};
