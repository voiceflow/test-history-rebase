import { Utils } from '@voiceflow/realtime-sdk';

export const {
  flatten,
  ADVANCE_LOGIC_TYPES,
  expressionfyV2,
  getHighestDepth,
  isDeepestExpressionAdvance,
  hasAdvanceChildExpression,
  expressionPreview,
  sanitizeSetValue,
} = Utils.expression;
