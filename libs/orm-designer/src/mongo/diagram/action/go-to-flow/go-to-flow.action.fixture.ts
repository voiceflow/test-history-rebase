import { flow } from '@/postgres/flow/flow.fixture';

import { NodeType } from '../../node/node-type.enum';
import { nextPort } from '../../port/port.fixture';
import { PortType } from '../../port/port-type.enum';
import type { GoToFlowAction } from './go-to-flow.action';

export const goToFlowAction: GoToFlowAction = {
  id: 'go-to-flow-action-1',
  parentID: 'actions-1',
  type: NodeType.ACTION__GO_TO_FLOW__V3,

  data: {
    flowID: flow.id,
  } as any,

  ports: {
    [PortType.NEXT]: nextPort,
  },
};
