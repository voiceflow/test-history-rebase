import { BaseNode } from '@voiceflow/base-types';
import { MenuOption } from '@voiceflow/ui';

export enum ConditionsEditorTabs {
  BUILDER = 'builder',
  EXPRESSION = 'expression',
}

export const EXPRESSION_PLACEHOLDER = 'Enter expression, use ‘{‘ to add variables';
export const VARIABLE_PLACEHOLDER = '{variable} or value';

export type TreeLogicExpressions = BaseNode.Utils.ExpressionTypeV2.AND | BaseNode.Utils.ExpressionTypeV2.OR;

export const LOGIC_TREE_OPTIONS: MenuOption<TreeLogicExpressions>[] = [
  {
    label: 'AND',
    value: BaseNode.Utils.ExpressionTypeV2.AND,
  },
  {
    label: 'OR',
    value: BaseNode.Utils.ExpressionTypeV2.OR,
  },
];
