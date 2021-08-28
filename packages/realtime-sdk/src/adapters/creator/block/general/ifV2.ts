import { Node } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import expressionAdapterV2 from '../../../expressionV2';
import { createBlockAdapter, defaultPortAdapter, PortsAdapter } from '../utils';

const ifAdapterV2 = createBlockAdapter<Node.IfV2.StepData, NodeData.IfV2>(
  ({ expressions, noMatch }) => ({
    expressions: expressionAdapterV2.mapFromDB(expressions),
    noMatch: {
      type: noMatch?.type || Node.Utils.NoMatchType.PATH,
      pathName: noMatch?.pathName || 'No Match',
    },
  }),
  ({ expressions, noMatch }) => ({
    expressions: expressionAdapterV2.mapToDB(expressions),
    noMatch,
  })
);

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

export default ifAdapterV2;
