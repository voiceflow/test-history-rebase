import * as Realtime from '@voiceflow/realtime-sdk';
import uniqBy from 'lodash/uniqBy';

import * as Project from '@/ducks/projectV2';
import { createReverter } from '@/ducks/utils';
import * as Version from '@/ducks/versionV2';

import {
  allPortsByIDsSelector,
  builtInPortTypeSelector,
  byKeyPortKeySelector,
  linksByNodeIDSelector,
  nodeByIDSelector,
  nodeDataByIDSelector,
  portsByNodeIDSelector,
} from '../selectors';
import { removeManyNodes } from '../utils';
import { createActiveDiagramReducer, createManyNodesRemovalInvalidators, DIAGRAM_INVALIDATORS } from './utils';

const removeManyNodesReducer = createActiveDiagramReducer(Realtime.node.removeMany, (state, { nodes }) => {
  const nodeIDs = nodes.map((node) => node.stepID ?? node.parentNodeID);

  removeManyNodes(state, nodeIDs);
});

export default removeManyNodesReducer;

export const removeManyNodesReverter = createReverter(
  Realtime.node.removeMany,

  ({ workspaceID, projectID, versionID, diagramID, nodes }, getState) => {
    const state = getState();
    const projectMeta = Project.active.metaSelector(state);
    const schemaVersion = Version.active.schemaVersionSelector(state);
    const nodeIDs = nodes.map<string>((node) => node.stepID ?? node.parentNodeID);
    const nodesWithData = nodeIDs.flatMap((nodeID) => {
      const node = nodeByIDSelector(state, { id: nodeID });
      const data = nodeDataByIDSelector(state, { id: nodeID });
      if (!node || !data) return [];

      return [{ node, data }];
    });

    if (!nodesWithData.length) return null;

    const actionContext = {
      workspaceID,
      projectID,
      versionID,
      diagramID,
    };

    const firstNodeData = nodesWithData[0];
    if (nodesWithData.length === 1 && firstNodeData.node.parentNode) {
      const parentNode = nodeByIDSelector(state, { id: firstNodeData.node.parentNode });

      if (!parentNode) return null;

      const index = parentNode.combinedNodes.indexOf(firstNodeData.node.id);

      if (index === -1) return null;

      const ports = portsByNodeIDSelector(state, { id: firstNodeData.node.id });
      const links = linksByNodeIDSelector(state, { id: firstNodeData.node.id });

      return [
        Realtime.node.insertStep({
          ...actionContext,
          index,
          data: firstNodeData.data,
          ports: {
            in: ports.in.map((port) => ({ id: port })),
            out: {
              byKey: Object.fromEntries(Object.entries(ports.out.byKey).map(([key, port]) => [key, { id: port }])),
              builtIn: Object.fromEntries(Object.entries(ports.out.builtIn).map(([key, port]) => [key, { id: port }])),
              dynamic: ports.out.dynamic.map((port) => ({ id: port })),
            },
          },
          stepID: firstNodeData.node.id,
          isActions: false,
          removeNodes: [],
          projectMeta,
          parentNodeID: firstNodeData.node.parentNode,
          schemaVersion,
          nodePortRemaps: [],
        }),

        ...links.map((link) => {
          const portKey = byKeyPortKeySelector(state, { id: link.source.portID });
          const portType = builtInPortTypeSelector(state, { id: link.source.portID });

          const context = {
            ...actionContext,
            data: link.data,
            linkID: link.id,
            sourceNodeID: link.source.nodeID,
            sourcePortID: link.source.portID,
            targetNodeID: link.target.nodeID,
            targetPortID: link.target.portID,
            sourceParentNodeID: parentNode.id,
          };

          if (portKey) return Realtime.link.addByKey({ ...context, key: portKey });

          if (portType) return Realtime.link.addBuiltin({ ...context, type: portType });

          return Realtime.link.addDynamic(context);
        }),
      ];
    }

    const portsIDs = nodeIDs.flatMap((nodeID) => Realtime.Utils.port.flattenAllPorts(portsByNodeIDSelector(state, { id: nodeID })));
    const ports = allPortsByIDsSelector(state, { ids: portsIDs });
    const links = uniqBy(
      nodeIDs.flatMap((nodeID) => linksByNodeIDSelector(state, { id: nodeID })),
      (link) => link.id
    );

    return Realtime.creator.importSnapshot({
      ...actionContext,
      links,
      ports,
      projectMeta,
      schemaVersion,
      nodesWithData,
    });
  },

  [...DIAGRAM_INVALIDATORS, ...createManyNodesRemovalInvalidators<Realtime.node.RemoveManyPayload>((origin) => origin.nodes)]
);
