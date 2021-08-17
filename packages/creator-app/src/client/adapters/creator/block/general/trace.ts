import { Node } from '@voiceflow/base-types';

import { NodeData } from '@/models';

import { createBlockAdapter, defaultPortAdapter, PortsAdapter } from '../utils';

const traceAdapter = createBlockAdapter<Node._v1.StepData<{ name: string; body: string }> & Record<string, unknown>, NodeData.Trace>(
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

export const tracePortsAdapter: PortsAdapter<NodeData.Trace> = {
  toDB: (ports, _, data) => {
    const dbPorts = defaultPortAdapter.toDB(ports, _, data);

    // assign path data to port data
    return dbPorts.map((port, index) => {
      const label = data.paths[index]?.label;
      const event = label ? { type: label } : undefined;

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

export default traceAdapter;
