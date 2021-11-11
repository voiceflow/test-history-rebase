import { Node } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import expressionAdapter from '../../../expression';
import { createBlockAdapter, defaultPortAdapter, migratePortsWithNoMatch, PortsAdapter } from '../utils';

export const defaultNoMatch: Node.IfV2.IfNoMatch = {
  type: Node.IfV2.IfNoMatchType.PATH,
  pathName: 'No Match',
};

const ifAdapter = createBlockAdapter<Node.IfV2.StepData, NodeData.IfV2>(
  ({ expressions, noMatch: { type, pathName = defaultNoMatch.pathName } = defaultNoMatch }) => ({
    expressions: expressionAdapter.mapFromDB(expressions),
    noMatch: {
      type: type ?? Node.IfV2.IfNoMatchType.NONE,
      pathName,
    },
  }),
  ({ expressions, noMatch }) => ({
    expressions: expressionAdapter.mapToDB(expressions),
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
  fromDB: (ports, node) => defaultPortAdapter.fromDB(migratePortsWithNoMatch(ports), node),
};

export default ifAdapter;
