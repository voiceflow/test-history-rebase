import { NodeType } from '../../node/node-type.enum';
import type { Port } from '../../port/port.dto';
import type { RandomStep } from './random.step';

const firstPort: Port = {
  key: 'random:1',
  link: null,
};
const secondPort: Port = {
  key: 'random:2',
  link: null,
};

export const randomStep: RandomStep = {
  id: 'random-step-1',
  parentID: 'block-1',
  type: NodeType.STEP__RANDOM__V3,

  data: {
    paths: [firstPort.key, secondPort.key],
  },

  ports: {
    [firstPort.key]: firstPort,
    [secondPort.key]: secondPort,
  },
};
