import { NodeType } from '../../node/node-type.enum';
import type { Port } from '../../port/port.dto';
import type { ConditionStep } from './condition.step';

const expressionCondition = {
  conditionID: 'expression-condition',
} as any;
const promptCondition = {
  conditionID: 'prompt-condition',
} as any;
const scriptCondition = {
  conditionID: 'script-condition',
} as any;

const expressionPort: Port = {
  key: expressionCondition.conditionID,
  link: null,
};
const promptPort: Port = {
  key: promptCondition.conditionID,
  link: null,
};
const scriptPort: Port = {
  key: scriptCondition.conditionID,
  link: null,
};

export const conditionStep: ConditionStep = {
  id: 'condition-step-1',
  parentID: 'block-1',
  type: NodeType.STEP__CONDITION__V3,

  data: {
    conditions: [expressionCondition, promptCondition, scriptCondition],
  },

  ports: {
    [expressionPort.key]: expressionPort,
    [promptPort.key]: promptPort,
    [scriptPort.key]: scriptPort,
  },
};
