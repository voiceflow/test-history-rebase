import type { Nullish } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';

import type { NodeOutPortSchema, NodePorts, NodePortSchema, PortsDescriptor } from '@/models';

export const IN_PORT_KEY = '-in';

export const getInPortID = (nodeID: string): string => `${nodeID}${IN_PORT_KEY}`;

export const createEmptyNodePorts = <T = string>(): NodePortSchema<T> => ({
  in: [],
  out: { byKey: {}, builtIn: {}, dynamic: [] },
});
export const createEmptyNodeOutPorts = <T = string>(): NodeOutPortSchema<T> => ({
  byKey: {},
  builtIn: {},
  dynamic: [],
});

export const extractNodePorts = (descriptor: PortsDescriptor): NodePorts => ({
  in: descriptor.in.map(({ id }) => id),
  out: {
    byKey: Utils.object.mapValue(descriptor.out.byKey, ({ id }) => id),
    dynamic: descriptor.out.dynamic.map(({ id }) => id),
    builtIn: Utils.object.mapValue(descriptor.out.builtIn, ({ id }) => id),
  },
});

export const flattenInPorts = <T>(ports: Nullish<NodePortSchema<T>>): T[] => {
  if (!ports) return [];

  return ports.in;
};

export const flattenOutPorts = <T>(ports: Nullish<NodePortSchema<T>>, options?: { skipByKeyPorts?: boolean }): T[] => {
  if (!ports) return [];

  const {
    out: { builtIn, dynamic: dynamicPorts, byKey: byKeyPorts },
  } = ports;

  return [
    ...Object.values(builtIn).filter(Boolean),
    ...dynamicPorts,
    ...(options?.skipByKeyPorts ? [] : Object.values(byKeyPorts).filter(Boolean)),
  ];
};

export const flattenAllPorts = <T>(ports: Nullish<NodePortSchema<T>>): T[] => [
  ...flattenInPorts(ports),
  ...flattenOutPorts(ports),
];
