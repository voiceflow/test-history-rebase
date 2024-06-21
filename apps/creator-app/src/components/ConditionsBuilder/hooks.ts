import { Utils } from '@voiceflow/common';
import { FeatureFlag, ObjectValue } from '@voiceflow/realtime-sdk';
import { parseScript, Syntax } from 'esprima';
import type * as estree from 'estree';
import _isNumber from 'lodash/isNumber';
import React from 'react';

import * as ERRORS from '@/constants/expressionValidationErrors.constant';
import * as DiagramV2 from '@/ducks/diagramV2';
import { useFeature } from '@/hooks/feature.hook';
import { useSelector } from '@/hooks/store.hook';
import { getErrorMessage } from '@/utils/error';
import { transformVariableToString } from '@/utils/slot';

const VALID_STRING_REGEX = /'.+'/gi;

type SyntaxType = ObjectValue<typeof Syntax> | 'ImportExpression' | 'ChainExpression';

const mapErrorMessage = (error: Error, text: string) => {
  const description = Utils.object.hasProperty(error, 'description') ? String(error.description) : error.message;

  if (Object.keys(ERRORS.ExpressionErrorMessages).includes(description)) {
    return ERRORS.ExpressionErrorMessages[description];
  }

  if (description.includes(ERRORS.UNEXPECTED_IDENTIFIER)) {
    return `The expression ‘${text}‘ is formatted incorrectly. Please enclose it in quotes, like this: '${text}'`;
  }
  if (description.includes(ERRORS.UNEXPECTED_TOKEN)) {
    const token = description.split(ERRORS.UNEXPECTED_TOKEN)[1];
    if (token.includes('ILLEGAL') || !token.trim()) {
      return ERRORS.ExpressionErrorMessages[ERRORS.ILLEGAL_TOKEN];
    }
    return `A '${token.trim()}' appears unexpectedly. Please check for any misplaced characters in your input.`;
  }

  return description;
};

const checkIdentifierExpression = (value: string, type: SyntaxType, variables: string[], isSetV3?: boolean) => {
  if (type !== Syntax.Identifier || variables.includes(value)) return;

  if (isSetV3) {
    throw new Error(
      `The expression ‘${value}‘ is formatted incorrectly. Please enclose it in quotes, like this: '${value}'`
    );
  }

  throw new Error(`string ${value} must be in quotes. Solution: '${value}'`);
};

const checkLiteralExpression = (expression: estree.Expression, isSetV3?: boolean) => {
  if (expression.type !== Syntax.Literal || _isNumber(expression.value) || expression.raw?.match(VALID_STRING_REGEX))
    return;

  if (isSetV3) {
    throw new Error(
      `The expression ‘${expression.raw ?? expression.value}‘ is formatted incorrectly. Please enclose it in quotes, like this: '${expression.value}'`
    );
  }

  throw new Error(`string ${expression.raw ?? expression.value} must be in quotes. Solution: '${expression.value}'`);
};

const checkBinaryExpression = (
  left: estree.Expression,
  right: estree.Expression,
  variables: string[],
  isSetV3?: boolean
) => {
  if (left.type === Syntax.Identifier) {
    checkIdentifierExpression(left.name, left.type, variables, isSetV3);
  } else {
    checkLiteralExpression(left, isSetV3);
  }

  if (right.type === Syntax.Identifier) {
    checkIdentifierExpression(right.name, right.type, variables, isSetV3);
  } else {
    checkLiteralExpression(right, isSetV3);
  }
  return true;
};

const checkLogicalExpression = (expression: estree.Expression, variables: string[], isSetV3?: boolean) => {
  if (expression.type === Syntax.LogicalExpression) {
    checkLogicalExpression(expression.left, variables, isSetV3);
    checkLogicalExpression(expression.right, variables, isSetV3);
  }

  if (expression.type === Syntax.BinaryExpression) {
    checkBinaryExpression(expression.left, expression.right, variables, isSetV3);
  }

  return true;
};

export const useExpressionValidator = () => {
  const variables = useSelector(DiagramV2.active.allEntitiesAndVariablesSelector);
  const variablesMap = useSelector(DiagramV2.active.entitiesAndVariablesMapSelector);
  const variableNames = React.useMemo(() => variables.map(({ name }) => name), [variables]);

  const setV3Enabled = useFeature(FeatureFlag.V3_SET_STEP);

  const [error, setError] = React.useState<string>('');

  const resetError = () => setError('');

  const validate = (text: string) => {
    try {
      const { body } = parseScript(`"use strict";\n${transformVariableToString(text, variablesMap)}`, {
        tolerant: true,
      });

      body.forEach((node) => {
        if (!('expression' in node)) return;

        const { expression } = node;

        switch (expression.type) {
          case Syntax.BinaryExpression:
            checkBinaryExpression(expression.left, expression.right, variableNames, setV3Enabled);
            break;
          case Syntax.LogicalExpression:
            checkLogicalExpression(expression, variableNames, setV3Enabled);
            break;
          case Syntax.CallExpression:
            break;
          default:
            checkIdentifierExpression(
              transformVariableToString(text, variablesMap),
              expression.type,
              variableNames,
              setV3Enabled
            );
            break;
        }
      });

      resetError();
      return true;
    } catch (error) {
      let message = '';

      if (error instanceof Error) {
        message = Utils.object.hasProperty(error, 'description') ? String(error.description) : error.message;

        if (setV3Enabled) {
          message = mapErrorMessage(error, text);
        }

        if (message === 'Unexpected identifier') {
          message = `string ${text} must be in quotes. Solution: '${text}'`;
        }

        setError(message);
      } else {
        setError(getErrorMessage(error, 'Expression syntax is invalid.'));
      }

      return false;
    }
  };

  return {
    error,
    validate,
    resetError,
  };
};
