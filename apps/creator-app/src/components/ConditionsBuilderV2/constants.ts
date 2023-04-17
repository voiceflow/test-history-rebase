import { BaseNode } from '@voiceflow/base-types';

export enum ConditionsEditorTabs {
  BUILDER = 'builder',
  EXPRESSION = 'expression',
}

export const EXPRESSION_PLACEHOLDER = 'Enter expression, use ‘{‘ to add variables';
export const VARIABLE_PLACEHOLDER = '{variable} or value';

export type TreeLogicExpressions = BaseNode.Utils.ExpressionTypeV2.AND | BaseNode.Utils.ExpressionTypeV2.OR;

export const ExpressionWithNoSecondValue = [BaseNode.Utils.ExpressionTypeV2.IS_EMPTY, BaseNode.Utils.ExpressionTypeV2.HAS_VALUE];

export const ExcludeValuesLogicType = [BaseNode.Utils.ExpressionTypeV2.HAS_VALUE, BaseNode.Utils.ExpressionTypeV2.IS_EMPTY];

export const DataConfigurableInterface = [BaseNode.Utils.ConditionsLogicInterface.VARIABLE, BaseNode.Utils.ConditionsLogicInterface.VALUE];
