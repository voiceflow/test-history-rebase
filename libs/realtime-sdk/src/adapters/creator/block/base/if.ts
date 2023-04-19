import expressionAdapter from '@realtime-sdk/adapters/expression';
import { NodeData } from '@realtime-sdk/models';
import { BaseModels, BaseNode } from '@voiceflow/base-types';

import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  dbBuiltInPortFactory,
  noMatchNoReplyAndDynamicOutPortsAdapter,
  noMatchNoReplyAndDynamicOutPortsAdapterV2,
  outPortDataToDB,
  outPortsDataToDB,
  syncDynamicPortsLength,
} from '../utils';

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
  (ports, options) =>
    syncDynamicPortsLength({
      nodeID: options.node.nodeID,
      ports: noMatchNoReplyAndDynamicOutPortsAdapter.fromDB(ports, options),
      length: options.node.data?.expressions?.length ?? 0,
    }),
  ({ builtIn: { [BaseModels.PortType.NO_MATCH]: noMatchPortData }, dynamic }, { data }) => [
    noMatchPortData ? outPortDataToDB(noMatchPortData) : dbBuiltInPortFactory(BaseModels.PortType.NO_MATCH), // should be first for backward compatible
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

export const ifOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.IfV2BuiltInPorts, NodeData.IfV2>(
  (ports, options) =>
    syncDynamicPortsLength({
      nodeID: options.node.nodeID,
      ports: noMatchNoReplyAndDynamicOutPortsAdapterV2.fromDB(ports, options),
      length: options.node.data?.expressions?.length ?? 0,
    }),
  ({ builtIn: { [BaseModels.PortType.NO_MATCH]: noMatchPortData }, dynamic }, { data }) => ({
    byKey: {},
    builtIn: { ...(noMatchPortData && { [BaseModels.PortType.NO_MATCH]: outPortDataToDB(noMatchPortData) }) },
    dynamic: outPortsDataToDB(dynamic).map((dbPort, index) => {
      const expressionTitle = data.expressions[index]?.name;

      return {
        ...dbPort,
        data: {
          ...dbPort.data,
          event: expressionTitle ? { type: expressionTitle } : undefined,
        },
      };
    }),
  })
);

export default ifAdapter;
