import { Node } from '@voiceflow/base-types';

export const ExpressionDisplayLabel: Record<string, string> = {
  [Node.Utils.ExpressionTypeV2.EQUALS]: 'Is',
  [Node.Utils.ExpressionTypeV2.NOT_EQUAL]: 'Is not',
  [Node.Utils.ExpressionTypeV2.GREATER]: 'Is greater than',
  [Node.Utils.ExpressionTypeV2.GREATER_OR_EQUAL]: 'Is greater than or equal',
  [Node.Utils.ExpressionTypeV2.LESS]: 'Is less than',
  [Node.Utils.ExpressionTypeV2.LESS_OR_EQUAL]: 'Is less than or equal',
  [Node.Utils.ExpressionTypeV2.CONTAINS]: 'Contains',
  [Node.Utils.ExpressionTypeV2.NOT_CONTAIN]: 'Does not contain',
  [Node.Utils.ExpressionTypeV2.STARTS_WITH]: 'Starts with',
  [Node.Utils.ExpressionTypeV2.ENDS_WITH]: 'Ends with',
  [Node.Utils.ExpressionTypeV2.HAS_VALUE]: 'Has any value',
  [Node.Utils.ExpressionTypeV2.IS_EMPTY]: 'Is empty',
};

export const ExpressionWithNoSecondValue = [Node.Utils.ExpressionTypeV2.IS_EMPTY, Node.Utils.ExpressionTypeV2.HAS_VALUE];

export const ExcludeValuesLogicType = [Node.Utils.ExpressionTypeV2.HAS_VALUE, Node.Utils.ExpressionTypeV2.IS_EMPTY];

export const DataConfigurableInterface = [Node.Utils.ConditionsLogicInterface.VARIABLE, Node.Utils.ConditionsLogicInterface.VALUE];

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
