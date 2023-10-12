import { nextPort } from '../../port/port.fixture';
import { PortType } from '../../port/port-type.enum';
import { NodeType } from '../node-type.enum';
import type { StartNode } from './start.node';

export const startNode: StartNode = {
  id: 'start-node-1',
  type: NodeType.START__V3,
  coords: [100, 200],

  data: {
    label: 'Start here...',
  },

  ports: {
    [PortType.NEXT]: nextPort,
  },
};
