import type { StepData as IfData } from '@voiceflow/general-types/build/nodes/ifV2';

import expressionAdapterV2 from '@/client/adapters/expressionV2';
import { NodeData } from '@/models';

import { createBlockAdapter, defaultPortAdapter, PortsAdapter } from '../utils';

export const ifAdapterV2 = createBlockAdapter<IfData, NodeData.IfV2>(
  ({ expressions }) => ({
    expressions: expressionAdapterV2.mapFromDB(expressions),
  }),
  ({ expressions }) => ({
    expressions: expressionAdapterV2.mapToDB(expressions),
  })
);

export default ifAdapterV2;

export const ifPortsAdapter: PortsAdapter<NodeData.IfV2> = {
  toDB: (ports, _, data) => {
    const dbPorts = defaultPortAdapter.toDB(ports, _, data);

    // assign path data to port data
    return dbPorts.map((port, index) => {
      const expressionTitle = data.expressions[index]?.name;

      const event = expressionTitle ? { type: expressionTitle } : undefined;

      return {
        ...port,
        data: {
          ...port.data,
          event,
        },
      };
    });
  },
  fromDB: defaultPortAdapter.fromDB,
};
