import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import { ACTION_CONTEXT, MOCK_STATE, NODE_DATA, NODE_ID, PORT, PROJECT_META } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - insertStep reducer', ({ createState, describeReducerV2, describeReverter }) => {
  describeReducerV2(Realtime.node.insertStep, ({ applyAction, normalizeContaining }) => {
    const blockNode = { ...NODE_DATA, nodeID: 'blockNode' };
    const stepID = 'stepNode';
    const stepData = { type: Realtime.BlockType.BUTTONS, name: 'node name' };

    it('ignore inserting steps for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        diagramID: 'foo',
        parentNodeID: blockNode.nodeID,
        stepID,
        ports: Realtime.Utils.port.createEmptyNodePorts(),
        data: stepData,
        index: 1,
        projectMeta: PROJECT_META,
        nodePortRemaps: [],
        schemaVersion: 2,
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('ignore inserting step with duplicate ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        parentNodeID: blockNode.nodeID,
        stepID: NODE_ID,
        ports: Realtime.Utils.port.createEmptyNodePorts(),
        data: stepData,
        index: 1,
        projectMeta: PROJECT_META,
        nodePortRemaps: [],
        schemaVersion: 2,
      });

      expect(result).toEqual(MOCK_STATE);
    });

    it('ignore inserting step with unrecognized block ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        parentNodeID: blockNode.nodeID,
        stepID,
        ports: Realtime.Utils.port.createEmptyNodePorts(),
        data: stepData,
        index: 1,
        projectMeta: PROJECT_META,
        nodePortRemaps: [],
        schemaVersion: 2,
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('insert a new step into an existing block', () => {
      const result = applyAction(
        {
          ...MOCK_STATE,
          nodes: normalize([blockNode], (node) => node.nodeID),
          stepIDsByParentNodeID: { [blockNode.nodeID]: ['foo', 'bar'] },
        },
        {
          ...ACTION_CONTEXT,
          parentNodeID: blockNode.nodeID,
          stepID,
          ports: Realtime.Utils.port.createEmptyNodePorts(),
          data: stepData,
          index: 1,
          projectMeta: PROJECT_META,
          nodePortRemaps: [],
          schemaVersion: 2,
        }
      );

      expect(result.nodes).toEqual(normalizeContaining([blockNode, { ...stepData, nodeID: stepID }], (node) => node.nodeID));
      expect(result.parentNodeIDByStepID).toEqual({ [stepID]: blockNode.nodeID });
      expect(result.stepIDsByParentNodeID).toEqual({ [blockNode.nodeID]: ['foo', stepID, 'bar'] });
      expect(result.portsByNodeID).toEqual({ [stepID]: Realtime.Utils.port.createEmptyNodePorts() });
      expect(result.linkIDsByNodeID).toEqual({ [stepID]: [] });
    });

    it('register all ports of an inserted step', () => {
      const inPortID = 'inPort';
      const byKeyPortKey = 'byKeyPortKey';
      const byKeyPortID = 'byKeyPortID';
      const dynamicPortID = 'dynamicPort';
      const builtInPortID = 'builtInPort';

      const result = applyAction(
        {
          ...MOCK_STATE,
          nodes: normalize([blockNode], (node) => node.nodeID),
          stepIDsByParentNodeID: { [blockNode.nodeID]: ['foo', 'bar'] },
        },
        {
          ...ACTION_CONTEXT,
          parentNodeID: blockNode.nodeID,
          stepID,
          ports: {
            in: [{ id: inPortID }],
            out: {
              byKey: {
                [byKeyPortKey]: { id: byKeyPortID },
              },
              dynamic: [{ id: dynamicPortID }],
              builtIn: {
                [BaseModels.PortType.NEXT]: { id: builtInPortID },
              },
            },
          },
          data: stepData,
          index: 1,
          projectMeta: PROJECT_META,
          nodePortRemaps: [],
          schemaVersion: 2,
        }
      );

      expect(result.ports).toEqual(normalizeContaining([PORT, { id: inPortID }, { id: dynamicPortID }, { id: builtInPortID }, { id: byKeyPortID }]));
      expect(result.portsByNodeID).toEqual({
        [stepID]: {
          in: [inPortID],
          out: {
            byKey: { [byKeyPortKey]: byKeyPortID },
            dynamic: [dynamicPortID],
            builtIn: { [BaseModels.PortType.NEXT]: builtInPortID },
          },
        },
      });
      expect(result.nodeIDByPortID).toEqual({ [inPortID]: stepID, [dynamicPortID]: stepID, [builtInPortID]: stepID, [byKeyPortID]: stepID });
      expect(result.linkIDsByPortID).toEqual({ [inPortID]: [], [dynamicPortID]: [], [builtInPortID]: [], [byKeyPortID]: [] });
    });
  });

  describeReverter(Realtime.node.insertStep, ({ revertAction }) => {
    it('registers an action reverter', () => {
      const parentNodeID = 'parentNodeID';
      const stepID = 'stepID';
      const firstNode = 'node1';
      const secondNode = 'node2';
      const thirdNode = 'node3';
      const firstPort = 'port1';
      const secondPort = 'port2';
      const firstLink = 'link1';
      const secondLink = 'link2';
      const rootState = createState({
        ...MOCK_STATE,
        links: normalize([
          {
            id: firstLink,
            source: { nodeID: firstNode, portID: firstPort },
            target: { nodeID: secondNode, portID: secondPort },
          },
          {
            id: secondLink,
            source: { nodeID: thirdNode, portID: secondPort },
            target: { nodeID: firstNode, portID: firstPort },
          },
        ]),
        parentNodeIDByStepID: { [thirdNode]: parentNodeID },
        linkIDsByPortID: {
          [firstPort]: [firstLink],
          [secondPort]: [secondLink],
        },
      });

      const result = revertAction(rootState, {
        ...ACTION_CONTEXT,
        parentNodeID,
        stepID,
        ports: { in: [], out: { dynamic: [], builtIn: {}, byKey: {} } },
        data: { type: Realtime.BlockType.BUTTONS, name: 'buttons' },
        index: 1,
        projectMeta: PROJECT_META,
        nodePortRemaps: [
          { nodeID: firstNode, ports: [{ portID: firstPort }], targetNodeID: secondNode },
          {
            nodeID: thirdNode,
            ports: [{ portID: secondPort }],
            targetNodeID: null,
          },
        ],
        schemaVersion: 2,
      });

      expect(result).toEqual([
        Realtime.node.removeMany({ ...ACTION_CONTEXT, nodes: [{ parentNodeID, stepID }] }),
        Realtime.link.addDynamic({
          ...ACTION_CONTEXT,
          linkID: secondLink,
          sourceNodeID: thirdNode,
          sourcePortID: secondPort,
          targetNodeID: firstNode,
          targetPortID: firstPort,
          sourceParentNodeID: parentNodeID,
        }),
      ]);
    });
  });
});
