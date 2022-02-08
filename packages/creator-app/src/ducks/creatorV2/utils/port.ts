import { Models } from '@voiceflow/base-types';
import { Nullish } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Draft } from 'immer';
import * as Normal from 'normal-store';

import { portFactory } from '@/ducks/creator/diagram/factories';

import { CreatorState } from '../types';

export const createEmptyNodePorts = <T = string>(): Realtime.NodePortSchema<T> => ({ in: [], out: { builtIn: {}, dynamic: [] } });

export const addPort = (
  state: Draft<CreatorState>,
  updatePorts: (ports: Realtime.NodePorts) => void,
  { nodeID, portID, port = {} }: { nodeID: string; portID: string; port?: Partial<Realtime.Port> }
): void => {
  if (Normal.hasOne(state.ports, portID)) return;

  const ports = state.portsByNodeID[nodeID];

  if (!ports || !Normal.hasOne(state.nodes, nodeID)) return;

  state.nodeIDByPortID[portID] = nodeID;
  state.linkIDsByPortID[portID] = [];

  updatePorts(ports);

  state.ports = Normal.appendOne(state.ports, portID, portFactory(nodeID, portID, port));
};

export const addDynamicPort = (
  state: Draft<CreatorState>,
  { nodeID, portID, label }: { nodeID: string; portID: string; label: Nullish<string> }
): void =>
  addPort(
    state,
    (ports) => {
      ports.out.dynamic.push(portID);
    },
    {
      nodeID,
      portID,
      port: { label: label ?? null },
    }
  );

export const addBuiltinPort = (
  state: Draft<CreatorState>,
  { nodeID, portID, type, platform }: { nodeID: string; portID: string; type: Models.PortType; platform: Nullish<Constants.PlatformType> }
): void =>
  addPort(
    state,
    (ports) => {
      ports.out.builtIn[type] = portID;
    },
    {
      nodeID,
      portID,
      port: { label: type, platform: platform ?? null },
    }
  );

export const flattenInPorts = <T>(ports: Nullish<Realtime.NodePortSchema<T>>): T[] => {
  if (!ports) return [];

  return ports.in;
};

export const flattenOutPorts = <T>(ports: Nullish<Realtime.NodePortSchema<T>>): T[] => {
  if (!ports) return [];

  const {
    out: { builtIn, dynamic: dynamicPorts },
  } = ports;

  return [...Object.values(builtIn).filter(Boolean), ...dynamicPorts];
};

export const flattenAllPorts = <T>(ports: Nullish<Realtime.NodePortSchema<T>>): T[] => [...flattenInPorts(ports), ...flattenOutPorts(ports)];
