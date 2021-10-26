import * as esprima from 'esprima';
import type * as estree from 'estree';
import _isNumber from 'lodash/isNumber';
import React from 'react';
import { useSelector } from 'react-redux';

import * as DiagramV2 from '@/ducks/diagramV2';
import { transformVariableToString } from '@/utils/slot';

import { useEnableDisable } from './toggle';

const VALID_STRING_REGEX = /'\w+'/gi;

enum EXP_TYPE {
  BINARY = 'BinaryExpression',
  LOGICAL = 'LogicalExpression',
  IDENTIFIER = 'Identifier',
  LITERAL = 'Literal',
  CALL = 'CallExpression',
}

type Expression = estree.BinaryExpression & estree.LogicalExpression & estree.CallExpression;

// eslint-disable-next-line import/prefer-default-export
export const useExpressionValidation = (): [boolean, () => void, (arg: string) => boolean, string] => {
  const [error, setError, reset] = useEnableDisable(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const variables = useSelector(DiagramV2.active.allSlotsAndVariablesSelector);

  const resetError = () => {
    setErrorMessage('');
    reset();
  };

  const handleError = (msg: string) => {
    setErrorMessage(msg);
    throw new Error(msg);
  };

  const isValidExpression = (expression: string) => {
    try {
      const {
        body: [, expressionStatement],
      } = esprima.parseScript(`"use strict"; ${transformVariableToString(expression)}`, { tolerant: true });

      const { left, right, type } = (expressionStatement as estree.ExpressionStatement).expression as Expression;

      switch (type) {
        case EXP_TYPE.BINARY:
          checkBinaryExpression(left, right, variables, handleError);
          return true;
        case EXP_TYPE.LOGICAL:
          checkLogicalExpression(left, variables, handleError);
          checkLogicalExpression(right, variables, handleError);
          return true;
        case EXP_TYPE.CALL:
          return true;
        default:
          checkIdentifierExpression(transformVariableToString(expression), type, variables, handleError);
          return true;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.description);
      setError();
      return false;
    }
  };

  return [error, resetError, isValidExpression, errorMessage];
};

// utils

const checkIdentifierExpression = (exp: string, type: EXP_TYPE, variables: string[], cb: (e: string) => void) => {
  if (type === EXP_TYPE.IDENTIFIER && !variables.includes(exp)) {
    return cb(`string ${exp} must be in quotes. Solution: '${exp}'`);
  }
};

const checkLiteralExpression = (exp: any, cb: (e: string) => void) => {
  if (exp.type === EXP_TYPE.LITERAL && !_isNumber(exp.value) && !exp.raw.match(VALID_STRING_REGEX)) {
    return cb(`string ${exp.value} must be in quotes. Solution: '${exp.value}'`);
  }
};

const checkBinaryExpression = (left: any, right: any, variables: string[], cb: (e: string) => void) => {
  if (left.type === EXP_TYPE.IDENTIFIER) {
    checkIdentifierExpression(left.name, left.type, variables, cb);
  } else {
    checkLiteralExpression(left, cb);
  }

  if (right.type === EXP_TYPE.IDENTIFIER) {
    checkIdentifierExpression(right.name, right.type, variables, cb);
  } else {
    checkLiteralExpression(right, cb);
  }
  return true;
};

const checkLogicalExpression = (exp: any, variables: string[], cb: (e: string) => void) => {
  if (exp.type === EXP_TYPE.LOGICAL) {
    checkLogicalExpression(exp.left, variables, cb);
    checkLogicalExpression(exp.right, variables, cb);
  }

  if (exp.type === EXP_TYPE.BINARY) {
    checkBinaryExpression(exp.left, exp.right, variables, cb);
  }

  return true;
};
