import { cardButtonList } from '@/postgres/attachment/card-button/card-button.fixture';
import { response } from '@/postgres/response/response.fixture';

import { NodeType } from '../../node/node-type.enum';
import type { Port } from '../../port/port.dto';
import { nextPort } from '../../port/port.fixture';
import { PortType } from '../../port/port-type.enum';
import type { ResponseStep } from './response.step';

const firstPort: Port = {
  key: cardButtonList[0].id,
  link: null,
};
const secondPort: Port = {
  key: cardButtonList[1].id,
  link: null,
};

export const responseStep: ResponseStep = {
  id: 'response-step-1',
  parentID: 'block-1',
  type: NodeType.STEP__RESPONSE__V3,

  data: {
    responseID: response.id,
  },

  ports: {
    [PortType.NEXT]: nextPort,
    [firstPort.key]: firstPort,
    [secondPort.key]: secondPort,
  },
};
