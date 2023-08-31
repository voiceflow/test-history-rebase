import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import { ACTION_CONTEXT, LINK_ID, MOCK_STATE, NODE_DATA, NODE_ID, PORT_ID, PROJECT_META, SCHEMA_VERSION } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - isolateSteps reducer', ({ createState, describeReducerV2, describeReverter }) => {
  describeReducerV2(Realtime.node.isolateSteps, ({ applyAction, normalizeContaining }) => {
    const sourceParentNodeID = 'sourceParentNodeID';
    const parentNodeID = 'parentNodeID';
    const stepIDs = ['stepID'];
    const blockCoords: Realtime.Point = [-90, 20];
    const blockName = 'New Block';

    it('ignore isolating step for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        schemaVersion: SCHEMA_VERSION,
        projectMeta: PROJECT_META,
        diagramID: 'foo',
        sourceParentNodeID: NODE_ID,
        parentNodeID,
        parentNodeData: {
          name: blockName,
          ports: Realtime.Utils.port.createEmptyNodePorts(),
          coords: blockCoords,
          type: Realtime.BlockType.COMBINED,
        },
        stepIDs,
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('ignore isolating step with duplicate block ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        schemaVersion: SCHEMA_VERSION,
        projectMeta: PROJECT_META,
        sourceParentNodeID: NODE_ID,
        parentNodeID: NODE_ID,
        parentNodeData: {
          name: blockName,
          ports: Realtime.Utils.port.createEmptyNodePorts(),
          coords: blockCoords,
          type: Realtime.BlockType.COMBINED,
        },
        stepIDs,
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('ignore isolating step with unrecognized step ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        schemaVersion: SCHEMA_VERSION,
        projectMeta: PROJECT_META,
        sourceParentNodeID: NODE_ID,
        parentNodeID,
        parentNodeData: {
          name: blockName,
          ports: Realtime.Utils.port.createEmptyNodePorts(),
          coords: blockCoords,
          type: Realtime.BlockType.COMBINED,
        },
        stepIDs,
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('ignore isolating step from unrecognized source block ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        schemaVersion: SCHEMA_VERSION,
        projectMeta: PROJECT_META,
        sourceParentNodeID,
        parentNodeID,
        parentNodeData: {
          name: blockName,
          ports: Realtime.Utils.port.createEmptyNodePorts(),
          coords: blockCoords,
          type: Realtime.BlockType.COMBINED,
        },
        stepIDs: [NODE_ID],
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('isolate a step from its block', () => {
      const stepID = stepIDs[0];
      const stepNode = { ...NODE_DATA, nodeID: stepID };

      const result = applyAction(
        {
          ...MOCK_STATE,
          blockIDs: [NODE_ID],
          nodes: normalize([NODE_DATA, stepNode], (node) => node.nodeID),
          parentNodeIDByStepID: { [stepID]: NODE_ID },
          stepIDsByParentNodeID: { [NODE_ID]: ['fooStep', stepID, 'barStep'] },
        },
        {
          ...ACTION_CONTEXT,
          schemaVersion: SCHEMA_VERSION,
          projectMeta: PROJECT_META,
          sourceParentNodeID: NODE_ID,
          parentNodeID,
          parentNodeData: {
            name: blockName,
            ports: Realtime.Utils.port.createEmptyNodePorts(),
            coords: blockCoords,
            type: Realtime.BlockType.COMBINED,
          },
          stepIDs: [stepID],
        }
      );

      expect(result.blockIDs).toEqual([NODE_ID, parentNodeID]);
      expect(result.nodes).toEqual(
        normalizeContaining(
          [NODE_DATA, stepNode, { type: Realtime.BlockType.COMBINED, blockColor: '', nodeID: parentNodeID, name: blockName }],
          (node) => node.nodeID
        )
      );
      expect(result.parentNodeIDByStepID).toEqual({ [stepID]: parentNodeID });
      expect(result.stepIDsByParentNodeID).toEqual({
        [NODE_ID]: ['fooStep', 'barStep'],
        [parentNodeID]: [stepID],
      });
    });
  });

  describeReverter(Realtime.node.isolateSteps, ({ revertAction }) => {
    it('registers an action reverter', () => {
      const parentNodeID = 'parentNodeID';
      const stepID = 'stepID';
      const sourceParentNodeID = 'sourceParentNodeID';
      const targetParentNodeID = 'targetParentNodeID';
      const targetPortID = 'targetPortID';
      const rootState = createState({
        ...MOCK_STATE,
        links: normalize([
          { id: LINK_ID, source: { nodeID: NODE_ID, portID: PORT_ID }, target: { nodeID: targetParentNodeID, portID: targetPortID } },
        ]),
        parentNodeIDByStepID: { [NODE_ID]: parentNodeID },
        stepIDsByParentNodeID: { [sourceParentNodeID]: ['first', stepID, 'third'] },
        linkIDsByPortID: { [PORT_ID]: [LINK_ID] },
      });

      const result = revertAction(rootState, {
        ...ACTION_CONTEXT,
        schemaVersion: SCHEMA_VERSION,
        projectMeta: PROJECT_META,
        sourceParentNodeID,
        parentNodeID,
        parentNodeData: {
          coords: [100, -100],
          name: 'New Block',
          ports: { in: [], out: { byKey: {}, builtIn: {}, dynamic: [] } },
          type: Realtime.BlockType.COMBINED,
        },
        stepIDs: [stepID],
      });

      expect(result).toEqual(
        Realtime.node.transplantSteps({
          ...ACTION_CONTEXT,
          index: 1,
          stepIDs: [stepID],
          sourceParentNodeID: parentNodeID,
          targetParentNodeID: sourceParentNodeID,
          nodePortRemaps: [],
          removeSource: true,
          removeNodes: [],
        })
      );
    });
  });
});
