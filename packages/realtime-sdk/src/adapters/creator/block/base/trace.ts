import { NodeData } from '@realtime-sdk/models';
import { AnyRecord, BaseNode } from '@voiceflow/base-types';

import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  dynamicOnlyOutPortsAdapter,
  dynamicOnlyOutPortsAdapterV2,
  syncDynamicPortsLength,
} from '../utils';

const traceAdapter = createBlockAdapter<BaseNode._v1.StepData<{ name: string; body: string; isBlocking: boolean }>, NodeData.Trace>(
  ({ payload, defaultPath }, options) => {
    const ports = (options.portsV2?.dynamic ?? options.ports ?? []) as BaseNode._v1.StepPort[];

    return {
      name: payload?.name || '',
      body: payload?.body || '',
      isBlocking: payload?.isBlocking || false,
      paths: ports.map((port, index) => ({
        isDefault: index === defaultPath,
        label: port?.data?.event?.type || '',
      })),
    };
  },
  ({ name, body, paths, isBlocking }) => ({
    _v: 1,
    payload: { name, body, isBlocking },
    defaultPath: paths.findIndex((p) => !!p.isDefault) ?? undefined,
  })
);

export const traceOutPortsAdapter = createOutPortsAdapter<AnyRecord, NodeData.Trace>(
  (ports, options) =>
    syncDynamicPortsLength({
      nodeID: options.node.nodeID,
      ports: dynamicOnlyOutPortsAdapter.fromDB(ports, options),
      length: options.node.data.paths?.length,
    }),
  (ports, options) =>
    dynamicOnlyOutPortsAdapter.toDB(ports, options).map((port, index) => {
      const label = options.data.paths[index]?.label;

      return {
        ...port,
        data: {
          ...port.data,
          event: label ? { type: label } : undefined,
        },
      };
    })
);

export const traceOutPortsAdapterV2 = createOutPortsAdapterV2<AnyRecord, NodeData.Trace>(
  (ports, options) =>
    syncDynamicPortsLength({
      nodeID: options.node.nodeID,
      ports: dynamicOnlyOutPortsAdapterV2.fromDB(ports, options),
      length: options.node.data.paths?.length,
    }),
  (ports, options) => {
    const dbPorts = dynamicOnlyOutPortsAdapterV2.toDB(ports, options);

    return {
      byKey: {},
      builtIn: {},
      // eslint-disable-next-line sonarjs/no-identical-functions
      dynamic: dbPorts.dynamic.map((port, index) => {
        const label = options.data.paths[index]?.label;

        return {
          ...port,
          data: {
            ...port.data,
            event: label ? { type: label } : undefined,
          },
        };
      }),
    };
  }
);

export default traceAdapter;
