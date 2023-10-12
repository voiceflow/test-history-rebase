import { function_ } from '@/postgres/function/function.fixture';
import { functionPathList } from '@/postgres/function/function-path/function-path.fixture';
import { functionVariable } from '@/postgres/function/function-variable/function-variable.fixture';

import { NodeType } from '../../node/node-type.enum';
import type { Port } from '../../port/port.dto';
import { nextPort } from '../../port/port.fixture';
import { PortType } from '../../port/port-type.enum';
import type { FunctionStep } from './function.step';

const firstPort: Port = {
  key: functionPathList[0].id,
  link: null,
};
const secondPort: Port = {
  key: functionPathList[1].id,
  link: null,
};

export const functionStep: FunctionStep = {
  id: 'function-step-1',
  parentID: 'block-1',
  type: NodeType.STEP__FUNCTION__V3,

  data: {
    functionID: function_.id,
    inputMapping: {
      [functionVariable.id]: ['hello ', { variableID: functionVariable.id }, ' world'],
    } as any,
    outputMapping: {
      [functionVariable.id]: functionVariable.id,
    },
  },

  ports: {
    [PortType.NEXT]: nextPort,
    [firstPort.key]: firstPort,
    [secondPort.key]: secondPort,
  },
};
