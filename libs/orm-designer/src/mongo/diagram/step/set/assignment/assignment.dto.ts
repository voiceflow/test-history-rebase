import { z } from 'zod';

import { Markup } from '@/common/dtos/markup.dto';

import { AssignmentPromptContext } from './assignment-prompt-context.enum';
import { AssignmentSource } from './assignment-source.enum';
import { AssignmentType } from './assignment-type.enum';

export type AnyAssignment = ManualAssignment | PromptAssignment;

const BaseAssignment = z.object({
  id: z.string(),
  variableID: z.string().uuid().nullable(),
});

/* manual assignment */

export const AssignmentValueSource = z.object({
  type: z.literal(AssignmentSource.VALUE),
  value: Markup,
});

export type AssignmentValueSource = z.infer<typeof AssignmentValueSource>;

export const AssignmentExpressionSource = z.object({
  type: z.literal(AssignmentSource.EXPRESSION),
  expression: Markup,
});

export type AssignmentExpressionSource = z.infer<typeof AssignmentExpressionSource>;

export const ManualAssignment = BaseAssignment.extend({
  type: z.literal(AssignmentType.MANUAL),
  source: z.discriminatedUnion('type', [AssignmentValueSource, AssignmentExpressionSource]),
});

export type ManualAssignment = z.infer<typeof ManualAssignment>;

/* prompt assignment */

export const PromptAssignment = BaseAssignment.extend({
  type: z.literal(AssignmentType.PROMPT),
  promptID: z.string().uuid().nullable(),
  turns: z.number(),
  context: z.nativeEnum(AssignmentPromptContext),
});

export type PromptAssignment = z.infer<typeof PromptAssignment>;
