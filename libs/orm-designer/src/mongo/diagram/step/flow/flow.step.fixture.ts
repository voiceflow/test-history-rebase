import { flow } from '@/postgres/flow/flow.fixture';

import { NodeType } from '../../node/node-type.enum';
import { nextPort } from '../../port/port.fixture';
import { PortType } from '../../port/port-type.enum';
import type { FlowStep } from './flow.step';

export const flowStep: FlowStep = {
  id: 'flow-step-1',
  parentID: 'block-1',
  type: NodeType.STEP__FLOW__V3,

  data: {
    flowID: flow.id,
  },

  ports: {
    [PortType.NEXT]: nextPort,
  },
};
