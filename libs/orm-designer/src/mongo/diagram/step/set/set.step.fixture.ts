import { prompt } from '@/postgres/prompt/prompt.fixture';
import { variable } from '@/postgres/variable/variable.fixture';

import { NodeType } from '../../node/node-type.enum';
import { nextPort } from '../../port/port.fixture';
import { PortType } from '../../port/port-type.enum';
import { AssignmentPromptContext } from './assignment/assignment-prompt-context.enum';
import { AssignmentSource } from './assignment/assignment-source.enum';
import { AssignmentType } from './assignment/assignment-type.enum';
import type { SetStep } from './set.step';

export const setStep: SetStep = {
  id: 'set-step-1',
  parentID: 'block-1',
  type: NodeType.STEP__SET__V3,

  data: {
    assignments: [
      {
        id: 'manual-value-assignment',
        type: AssignmentType.MANUAL,
        source: { type: AssignmentSource.VALUE, value: ['hello world'] },
        variableID: variable.id,
      },
      {
        id: 'manual-expression-assignment',
        type: AssignmentType.MANUAL,
        source: { type: AssignmentSource.EXPRESSION, expression: ['100 + 23'] },
        variableID: variable.id,
      },
      {
        id: 'prompt-assignment',
        type: AssignmentType.PROMPT,
        promptID: prompt.id,
        turns: 5,
        context: AssignmentPromptContext.KNOWLEDGE_BASE,
        variableID: variable.id,
      },
    ],
  } as any,

  ports: {
    [PortType.NEXT]: nextPort,
  },
};
