import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { BlockType } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';

import { mergeEntityMaps } from '../utils';

export const entityMapSelector = createSelector(
  [CreatorV2.getNodeByIDSelector, CreatorV2.getNodeDataByIDSelector, CreatorV2.getPortByIDSelector],
  (getNode, getNodeData, getPort) =>
    (nodeID: string, rename: boolean, nodeOverrides: Partial<Realtime.Node>): Realtime.EntityMap => {
      const node = getNode({ id: nodeID })!;
      const data = getNodeData({ id: nodeID })!;

      return {
        ports: Realtime.Utils.port.flattenAllPorts(node?.ports).map((portID) => getPort({ id: portID })!),
        links: [],
        nodesWithData: [{ node: { ...node, ...nodeOverrides }, data: rename ? { ...data, name: `${data?.name} copy` } : data }],
      };
    }
);

export const parentEntityMapSelector = createSelector(
  [CreatorV2.getNodeByIDSelector, CreatorV2.getNodeDataByIDSelector, CreatorV2.getPortByIDSelector],
  (getNode, getNodeData, getPort) =>
    (nodeID: string, rename: boolean, nodeOverrides: Partial<Realtime.Node>): Realtime.EntityMap => {
      const node = getNode({ id: nodeID })!;
      const data = getNodeData({ id: nodeID })!;
      const newNodeID = Utils.id.objectID();

      const inPorts = node.ports.in.map((portID) => ({ ...getPort({ id: portID })!, id: Utils.id.objectID(), nodeID: newNodeID }));
      const outDynamicPorts = node.ports.out.dynamic.map((portID) => ({
        ...getPort({ id: portID })!,
        id: Utils.id.objectID(),
        nodeID: newNodeID,
      }));

      const outBuiltInPortsEntities = Object.entries(node.ports.out.builtIn)
        .filter(([, portID]) => !!portID)
        .map<[BaseModels.PortType, Realtime.Port]>(([type, portID]) => [
          type as BaseModels.PortType,
          {
            ...getPort({ id: portID })!,
            id: Utils.id.objectID(),
            nodeID: newNodeID,
          },
        ]);

      const byKeyPorts = Object.entries(node.ports.out.byKey)
        .filter(([, portID]) => !!portID)
        .map<[string, Realtime.Port]>(([key, portID]) => [
          key as string,
          {
            ...getPort({ id: portID })!,
            id: Utils.id.objectID(),
            nodeID: newNodeID,
          },
        ]);

      return {
        nodesWithData: [
          {
            node: {
              ...node,
              ...nodeOverrides,
              id: newNodeID,
              ports: {
                in: inPorts.map(({ id }) => id),
                out: {
                  byKey: byKeyPorts.reduce((acc, [key, port]) => Object.assign(acc, { [key]: port.id }), {}),
                  dynamic: outDynamicPorts.map(({ id }) => id),
                  builtIn: outBuiltInPortsEntities.reduce((acc, [type, port]) => Object.assign(acc, { [type]: port.id }), {}),
                },
              },
            },
            data: {
              ...data,
              name: rename ? `${data.name} copy` : data.name,
              nodeID: newNodeID,
            },
          },
        ],
        ports: [...inPorts, ...outDynamicPorts, ...outBuiltInPortsEntities.map(([, port]) => port), ...byKeyPorts.map(([, port]) => port)],
        links: [],
      };
    }
);

export const childEntityMapSelector = createSelector(
  [CreatorV2.getNodeByIDSelector, entityMapSelector],
  (getNode, getEntityMap) =>
    (nodeID: string): Realtime.EntityMap => {
      const node = getNode({ id: nodeID })!;

      if (node.type !== BlockType.COMBINED) {
        return {
          nodesWithData: [],
          ports: [],
          links: [],
        };
      }

      return node.combinedNodes.map((childNodeID) => getEntityMap(childNodeID, false, { x: node.x, y: node.y })).reduce(mergeEntityMaps);
    }
);
