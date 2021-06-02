import { ConditionsLogicInterface, ExpressionTypeV2 } from '@voiceflow/general-types';

export const ExpressionDisplayLabel: Record<string, string> = {
  [ExpressionTypeV2.EQUALS]: 'Is',
  [ExpressionTypeV2.NOT_EQUAL]: 'Is not',
  [ExpressionTypeV2.GREATER]: 'Is greater than',
  [ExpressionTypeV2.GREATER_OR_EQUAL]: 'Is greater than or equal',
  [ExpressionTypeV2.LESS]: 'Is less than',
  [ExpressionTypeV2.LESS_OR_EQUAL]: 'Is less than or equal',
  [ExpressionTypeV2.CONTAINS]: 'Contains',
  [ExpressionTypeV2.NOT_CONTAIN]: 'Does not contain',
  [ExpressionTypeV2.STARTS_WITH]: 'Starts with',
  [ExpressionTypeV2.ENDS_WITH]: 'Ends with',
  [ExpressionTypeV2.HAS_VALUE]: 'Has any value',
  [ExpressionTypeV2.IS_EMPTY]: 'Is empty',
};

export const ExcludeValuesLogicType = [ExpressionTypeV2.HAS_VALUE, ExpressionTypeV2.IS_EMPTY];

export const DataConfigurableInterface = [ConditionsLogicInterface.VARIABLE, ConditionsLogicInterface.VALUE];

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
