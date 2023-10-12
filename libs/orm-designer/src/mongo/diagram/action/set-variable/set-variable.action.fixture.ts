import { prompt } from '@/postgres/prompt/prompt.fixture';
import { variable } from '@/postgres/variable/variable.fixture';

import { NodeType } from '../../node/node-type.enum';
import { nextPort } from '../../port/port.fixture';
import { PortType } from '../../port/port-type.enum';
import { AssignmentPromptContext } from '../../step/set/assignment/assignment-prompt-context.enum';
import { AssignmentSource } from '../../step/set/assignment/assignment-source.enum';
import { AssignmentType } from '../../step/set/assignment/assignment-type.enum';
import type { SetVariableAction } from './set-variable.action';

export const setVariableManualAction: SetVariableAction = {
  id: 'set-variable-action-1',
  parentID: 'actions-1',
  type: NodeType.ACTION__SET_VARIABLE__V3,

  data: {
    label: 'Set variable',
    assignment: {
      type: AssignmentType.MANUAL,
      variableID: variable.id,
      source: {
        type: AssignmentSource.EXPRESSION,
        expression: ['10 * 4'],
      },
    },
  },

  ports: {
    [PortType.NEXT]: nextPort,
  },
};

export const setVariablePromptAction: SetVariableAction = {
  id: 'set-variable-action-2',
  parentID: 'actions-1',
  type: NodeType.ACTION__SET_VARIABLE__V3,

  data: {
    label: 'Set variable',
    assignment: {
      type: AssignmentType.PROMPT,
      variableID: variable.id,
      promptID: prompt.id,
      turns: 4,
      context: AssignmentPromptContext.KNOWLEDGE_BASE,
    },
  },

  ports: {
    [PortType.NEXT]: nextPort,
  },
};
