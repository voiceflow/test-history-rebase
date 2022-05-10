import { NodePorts, NodePortSchema, PortsDescriptor } from '@realtime-sdk/models';
import { Nullish } from '@voiceflow/common';

export const createEmptyNodePorts = <T = string>(): NodePortSchema<T> => ({ in: [], out: { builtIn: {}, dynamic: [] } });

export const extractNodePorts = (descriptor: PortsDescriptor): NodePorts => ({
  in: descriptor.in.map(({ id }) => id),
  out: {
    dynamic: descriptor.out.dynamic.map(({ id }) => id),
    builtIn: Object.fromEntries(Object.entries(descriptor.out.builtIn).map(([key, { id }]) => [key, id])),
  },
});

export const flattenInPorts = <T>(ports: Nullish<NodePortSchema<T>>): T[] => {
  if (!ports) return [];

  return ports.in;
};

export const flattenOutPorts = <T>(ports: Nullish<NodePortSchema<T>>): T[] => {
  if (!ports) return [];

  const {
    out: { builtIn, dynamic: dynamicPorts },
  } = ports;

  return [...Object.values(builtIn).filter(Boolean), ...dynamicPorts];
};

export const flattenAllPorts = <T>(ports: Nullish<NodePortSchema<T>>): T[] => [...flattenInPorts(ports), ...flattenOutPorts(ports)];
