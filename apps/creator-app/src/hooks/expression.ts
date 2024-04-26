import { Utils } from '@voiceflow/common';
import type { ObjectValue } from '@voiceflow/realtime-sdk';
import { parseScript, Syntax } from 'esprima';
import type * as estree from 'estree';
import _isNumber from 'lodash/isNumber';
import React from 'react';
import { useSelector } from 'react-redux';

import * as DiagramV2 from '@/ducks/diagramV2';
import { getErrorMessage } from '@/utils/error';
import { transformVariableToString } from '@/utils/slot';

const VALID_STRING_REGEX = /'.+'/gi;

type SyntaxType = ObjectValue<typeof Syntax> | 'ImportExpression' | 'ChainExpression';

const checkIdentifierExpression = (value: string, type: SyntaxType, variables: string[]) => {
  if (type !== Syntax.Identifier || variables.includes(value)) return;

  throw new Error(`string ${value} must be in quotes. Solution: '${value}'`);
};

const checkLiteralExpression = (expression: estree.Expression) => {
  if (expression.type !== Syntax.Literal || _isNumber(expression.value) || expression.raw?.match(VALID_STRING_REGEX))
    return;

  throw new Error(`string ${expression.raw ?? expression.value} must be in quotes. Solution: '${expression.value}'`);
};

const checkBinaryExpression = (left: estree.Expression, right: estree.Expression, variables: string[]) => {
  if (left.type === Syntax.Identifier) {
    checkIdentifierExpression(left.name, left.type, variables);
  } else {
    checkLiteralExpression(left);
  }

  if (right.type === Syntax.Identifier) {
    checkIdentifierExpression(right.name, right.type, variables);
  } else {
    checkLiteralExpression(right);
  }
  return true;
};

const checkLogicalExpression = (expression: estree.Expression, variables: string[]) => {
  if (expression.type === Syntax.LogicalExpression) {
    checkLogicalExpression(expression.left, variables);
    checkLogicalExpression(expression.right, variables);
  }

  if (expression.type === Syntax.BinaryExpression) {
    checkBinaryExpression(expression.left, expression.right, variables);
  }

  return true;
};

export const useExpressionValidator = () => {
  const variables = useSelector(DiagramV2.active.allEntitiesAndVariablesSelector);
  const variablesMap = useSelector(DiagramV2.active.entitiesAndVariablesMapSelector);
  const variableNames = React.useMemo(() => variables.map(({ name }) => name), [variables]);

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
            checkBinaryExpression(expression.left, expression.right, variableNames);
            break;
          case Syntax.LogicalExpression:
            checkLogicalExpression(expression, variableNames);
            break;
          case Syntax.CallExpression:
            break;
          default:
            checkIdentifierExpression(transformVariableToString(text, variablesMap), expression.type, variableNames);
            break;
        }
      });

      resetError();
      return true;
    } catch (error) {
      let message = '';

      if (error instanceof Error) {
        message = Utils.object.hasProperty(error, 'description') ? String(error.description) : error.message;

        if (message === 'Unexpected identifier') {
          message = `string ${text} must be in quotes. Solution: '${text}'`;
        }
      }

      if (!message) {
        message = getErrorMessage(error, 'Expression syntax is invalid.');
      }

      setError(message);

      return false;
    }
  };

  return {
    error,
    validate,
    resetError,
  };
};
