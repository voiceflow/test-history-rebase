import type { Markup } from '@/common';

import type { AssignmentPromptContext } from './assignment-prompt-context.enum';
import type { AssignmentSource } from './assignment-source.enum';
import type { AssignmentType } from './assignment-type.enum';

export type AnyAssignment = ManualAssignment | PromptAssignment;

export interface BaseAssignment {
  id: string;
  variableID: string | null;
}

/* manual assignment */

export interface AssignmentValueSource {
  type: AssignmentSource.VALUE;
  value: Markup;
}

export interface AssignmentExpressionSource {
  type: AssignmentSource.EXPRESSION;
  expression: Markup;
}

export interface ManualAssignment extends BaseAssignment {
  type: AssignmentType.MANUAL;
  source: AssignmentValueSource | AssignmentExpressionSource;
}

/* prompt assignment */

export interface PromptAssignment extends BaseAssignment {
  type: AssignmentType.PROMPT;
  promptID: string | null;
  turns: number;
  context: AssignmentPromptContext;
}
