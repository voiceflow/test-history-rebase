import expressionAdapter from '@realtime-sdk/adapters/expression';
import { NodeData } from '@realtime-sdk/models';
import { BaseModels, BaseNode } from '@voiceflow/base-types';

import { createBlockAdapter, createOutPortsAdapter, noMatchNoReplyAndDynamicOutPortsAdapter, outPortDataToDB, outPortsDataToDB } from '../utils';

export const defaultNoMatch: BaseNode.IfV2.IfNoMatch = {
  type: BaseNode.IfV2.IfNoMatchType.PATH,
  pathName: 'No Match',
};

const ifAdapter = createBlockAdapter<BaseNode.IfV2.StepData, NodeData.IfV2>(
  ({ expressions, noMatch: { type, pathName = defaultNoMatch.pathName } = defaultNoMatch }) => ({
    expressions: expressionAdapter.mapFromDB(expressions),
    noMatch: {
      type: type ?? BaseNode.IfV2.IfNoMatchType.NONE,
      pathName,
    },
  }),
  ({ expressions, noMatch }) => ({
    expressions: expressionAdapter.mapToDB(expressions),
    noMatch,
  })
);

export const ifOutPortsAdapter = createOutPortsAdapter<NodeData.IfV2BuiltInPorts, NodeData.IfV2>(
  (ports, options) => noMatchNoReplyAndDynamicOutPortsAdapter.fromDB(ports, options),
  ({ builtIn: { [BaseModels.PortType.NO_MATCH]: noMatchPortData }, dynamic }, { data }) => [
    outPortDataToDB(noMatchPortData), // should be first for backward compatible
    ...outPortsDataToDB(dynamic).map((dbPort, index) => {
      const expressionTitle = data.expressions[index]?.name;

      return {
        ...dbPort,
        data: {
          ...dbPort.data,
          event: expressionTitle ? { type: expressionTitle } : undefined,
        },
      };
    }),
  ]
);

export default ifAdapter;
