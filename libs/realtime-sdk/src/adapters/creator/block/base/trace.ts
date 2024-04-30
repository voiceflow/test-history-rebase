import type { AnyRecord, BaseNode } from '@voiceflow/base-types';

import { NodeData } from '@/models';

import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  dynamicOnlyOutPortsAdapter,
  dynamicOnlyOutPortsAdapterV2,
  syncDynamicPortsLength,
} from '../utils';

const traceAdapter = createBlockAdapter<
  BaseNode._v1.StepData<{
    name: string;
    body: string;
    bodyType: NodeData.TraceBodyType;
    scope: NodeData.TraceScope;
    isBlocking: boolean;
  }>,
  NodeData.Trace
>(
  ({ payload, defaultPath, paths }, options) => {
    const ports = (options.portsV2?.dynamic ?? options.ports ?? []) as BaseNode._v1.StepPort[];

    return {
      name: payload?.name || '',
      body: payload?.body || '',
      bodyType: payload?.bodyType || NodeData.TraceBodyType.TEXT,
      scope: payload?.scope || NodeData.TraceScope.LOCAL,
      isBlocking: payload?.isBlocking || false,
      paths:
        paths ||
        /** @deprecated no longer store data in ports */
        ports.map((port, index) => ({
          isDefault: index === defaultPath,
          label: port?.data?.event?.type || '',
        })),
    };
  },
  ({ name, body, bodyType, scope, paths, isBlocking }) => ({
    _v: 1,
    paths,
    payload: { name, body, bodyType, scope, isBlocking },
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
  (ports, options) => dynamicOnlyOutPortsAdapter.toDB(ports, options)
);

export const traceOutPortsAdapterV2 = createOutPortsAdapterV2<AnyRecord, NodeData.Trace>(
  (ports, options) =>
    syncDynamicPortsLength({
      nodeID: options.node.nodeID,
      ports: dynamicOnlyOutPortsAdapterV2.fromDB(ports, options),
      length: options.node.data.paths?.length,
    }),
  (ports, options) => dynamicOnlyOutPortsAdapterV2.toDB(ports, options)
);

export default traceAdapter;
