import { BaseNode } from '@voiceflow/base-types';

export const ExpressionDisplayLabel: Record<string, string> = {
  [BaseNode.Utils.ExpressionTypeV2.EQUALS]: 'Is',
  [BaseNode.Utils.ExpressionTypeV2.NOT_EQUAL]: 'Is not',
  [BaseNode.Utils.ExpressionTypeV2.GREATER]: 'Is greater than',
  [BaseNode.Utils.ExpressionTypeV2.GREATER_OR_EQUAL]: 'Is greater than or equal',
  [BaseNode.Utils.ExpressionTypeV2.LESS]: 'Is less than',
  [BaseNode.Utils.ExpressionTypeV2.LESS_OR_EQUAL]: 'Is less than or equal',
  [BaseNode.Utils.ExpressionTypeV2.CONTAINS]: 'Contains',
  [BaseNode.Utils.ExpressionTypeV2.NOT_CONTAIN]: 'Does not contain',
  [BaseNode.Utils.ExpressionTypeV2.STARTS_WITH]: 'Starts with',
  [BaseNode.Utils.ExpressionTypeV2.ENDS_WITH]: 'Ends with',
  [BaseNode.Utils.ExpressionTypeV2.HAS_VALUE]: 'Has any value',
  [BaseNode.Utils.ExpressionTypeV2.IS_EMPTY]: 'Is empty',
};

export const ExpressionWithNoSecondValue = [BaseNode.Utils.ExpressionTypeV2.IS_EMPTY, BaseNode.Utils.ExpressionTypeV2.HAS_VALUE];

export const ExcludeValuesLogicType = [BaseNode.Utils.ExpressionTypeV2.HAS_VALUE, BaseNode.Utils.ExpressionTypeV2.IS_EMPTY];

export const DataConfigurableInterface = [BaseNode.Utils.ConditionsLogicInterface.VARIABLE, BaseNode.Utils.ConditionsLogicInterface.VALUE];

export const SupportedOperations = [
  {
    label: 'addition',
    icon: '+',
  },
  {
    label: 'subtraction',
    icon: '-',
  },
  {
    label: 'multiplication',
    icon: '*',
  },
  {
    label: 'division',
    icon: '/',
  },
  {
    label: 'brackets',
    icon: '()',
  },
  {
    label: 'is not',
    icon: '=/=',
  },
  {
    label: 'is',
    icon: '=',
  },
];
