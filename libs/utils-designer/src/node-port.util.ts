import { Utils } from '@voiceflow/common';
import type { BasePorts, NodePort, NodePortLinkData } from '@voiceflow/dtos';

export const nodePortFactory = <T extends NodePort['type']>({
  id,
  type,
  data,
  target,
}: {
  id?: string;
  type: T;
  data?: NodePortLinkData;
  target: null;
}): NodePort & { type: T } => ({
  id: id ?? Utils.id.objectID(),
  type,
  data,
  target,
});

interface NodePortsFactory {
  <Ports extends BasePorts>(ports: Ports): Ports;

  <Ports extends Partial<BasePorts>>(ports: Ports): Omit<BasePorts, keyof Ports> & Ports;

  (): BasePorts;
}
export const nodePortsFactory: NodePortsFactory = (ports: Partial<BasePorts> = {}) => ({
  byKey: {},
  builtIn: {},
  dynamic: [],
  ...ports,
});
