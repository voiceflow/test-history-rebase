import { BaseModels } from '@voiceflow/base-types';
import { Nullish, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Draft } from 'immer';
import * as Normal from 'normal-store';

import { portFactory } from '@/ducks/creator/diagram/factories';

import { CreatorState } from '../types';
import { removeLink } from './link';

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

export const addByKeyPort = (
  state: Draft<CreatorState>,
  { nodeID, portID, label, key }: { nodeID: string; portID: string; label: Nullish<string>; key: string }
): void =>
  addPort(
    state,
    (ports) => {
      Object.assign(ports.out.byKey, { [key]: portID });
    },
    {
      nodeID,
      portID,
      port: { label: label ?? null },
    }
  );

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
  { nodeID, portID, type }: { nodeID: string; portID: string; type: BaseModels.PortType }
): void =>
  addPort(
    state,
    (ports) => {
      ports.out.builtIn[type] = portID;
    },
    {
      nodeID,
      portID,
      port: { label: type },
    }
  );

export type RemovePortFromNode = (port: Draft<Realtime.NodePorts>, portID: string) => void;

export const createPortRemover =
  (removePortFromNode: RemovePortFromNode) =>
  (state: Draft<CreatorState>, nodeID: string, portID: string): void => {
    const ports = state.portsByNodeID[nodeID];
    const linkIDs = state.linkIDsByPortID[portID] ?? [];

    linkIDs.forEach((linkID) => {
      removeLink(state, linkID);
    });

    if (ports) {
      removePortFromNode(ports, portID);
    }

    delete state.nodeIDByPortID[portID];
    delete state.linkIDsByPortID[portID];

    state.ports = Normal.removeOne(state.ports, portID);
  };

const deleteByValue = <T>(obj: Draft<Record<string, T>>, value: T) =>
  Object.keys(obj).forEach((key) => {
    if (obj[key] === value) {
      delete obj[key];
    }
  });

const removeByKeyPortFromNode: RemovePortFromNode = (ports, portID) => {
  deleteByValue(ports.out.byKey, portID);
};

const removeDynamicPortFromNode: RemovePortFromNode = (ports, portID) => {
  ports.out.dynamic = Utils.array.withoutValue(ports.out.dynamic, portID);
};

const removeBuiltinPortFromNode: RemovePortFromNode = (ports, portID) => {
  deleteByValue(ports.out.builtIn, portID);
};

export const removeDynamicPort = createPortRemover(removeDynamicPortFromNode);

export const removeBuiltinPort = createPortRemover(removeBuiltinPortFromNode);

export const removeByKeyPort = createPortRemover(removeByKeyPortFromNode);

export const removeManyByKeyPort = (state: Draft<CreatorState>, nodeID: string, keys: string[]): void => {
  state.portsByNodeID;
  const ports = state.portsByNodeID[nodeID];
  const portIDs = keys.map((key) => ports?.out.byKey[key]).filter(Boolean) as string[];
  const linkIDs = portIDs.flatMap((portID) => state.linkIDsByPortID[portID] ?? []);

  linkIDs.forEach((linkID) => {
    removeLink(state, linkID);
  });

  portIDs.forEach((portID) => {
    if (ports) {
      deleteByValue(ports.out.byKey, portID);
    }

    delete state.nodeIDByPortID[portID];
    delete state.linkIDsByPortID[portID];
  });

  state.ports = Normal.removeMany(state.ports, portIDs);
};

export const removeAnyPort = createPortRemover((ports, portID) => {
  removeByKeyPortFromNode(ports, portID);
  removeDynamicPortFromNode(ports, portID);
  removeBuiltinPortFromNode(ports, portID);
});

export const removePort = (state: Draft<CreatorState>, portID: string): void => {
  const nodeID = state.nodeIDByPortID[portID] ?? null;

  if (nodeID) {
    removeAnyPort(state, nodeID, portID);
  }
};
