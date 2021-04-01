import { ConditionsLogicInterface, ExpressionTypeV2 } from '@voiceflow/general-types';

export const ExpressionDisplayLabel = {
  [ExpressionTypeV2.EQUALS]: 'Equals',
  [ExpressionTypeV2.NOT_EQUAL]: "Doesn't Equal",
  [ExpressionTypeV2.GREATER]: 'Is Greater than',
  [ExpressionTypeV2.GREATER_OR_EQUAL]: 'Is Greator than or Equal',
  [ExpressionTypeV2.LESS]: 'Is Less than',
  [ExpressionTypeV2.LESS_OR_EQUAL]: 'Is Less than or Equal',
  [ExpressionTypeV2.CONTAINS]: 'Contains',
  [ExpressionTypeV2.NOT_CONTAIN]: 'Does not Contain',
  [ExpressionTypeV2.STARTS_WITH]: 'Starts with',
  [ExpressionTypeV2.ENDS_WITH]: 'Ends with',
  [ExpressionTypeV2.HAS_VALUE]: 'Has any Value',
  [ExpressionTypeV2.IS_EMPTY]: 'Is Empty',
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
    label: "doesn't equal",
    icon: '=/=',
  },
  {
    label: 'equal',
    icon: '=',
  },
];
