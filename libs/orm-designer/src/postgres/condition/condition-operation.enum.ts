export enum ConditionOperation {
  IS = 'is',
  IS_NOT = 'is_not',

  IS_EMPTY = 'is_empty',
  IS_NOT_EMPTY = 'is_not_empty',

  GREATER_THAN = 'greater_than',
  GREATER_OR_EQUAL = 'greater_or_equal',
  LESS_THAN = 'less_than',
  LESS_OR_EQUAL = 'less_or_equal',

  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
}
