import { NodeData } from '@realtime-sdk/models';
import { AnyRecord, BaseNode } from '@voiceflow/base-types';

import { createBlockAdapter, createOutPortsAdapter, dynamicOnlyOutPortsAdapter } from '../utils';

const traceAdapter = createBlockAdapter<BaseNode._v1.StepData<{ name: string; body: string }> & Record<string, unknown>, NodeData.Trace>(
  ({ payload, defaultPath, ports }) => ({
    name: payload?.name || '',
    body: payload?.body || '',
    paths: Array.isArray(ports)
      ? ports.map((port, index) => ({
          isDefault: index === defaultPath,
          label: port?.data?.event?.type || '',
        }))
      : [],
  }),
  ({ name, body, paths }) => ({
    _v: 1,
    payload: { name, body },
    defaultPath: paths.findIndex((p) => !!p.isDefault) ?? undefined,
  })
);

export const traceOutPortsAdapter = createOutPortsAdapter<AnyRecord, NodeData.Trace>(
  (ports, options) => dynamicOnlyOutPortsAdapter.fromDB(ports, options),
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

export default traceAdapter;
