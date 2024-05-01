import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';
import { describe, expect, it } from 'vitest';

import { BlockType } from '@/constants';
import { createDuckTools } from '@/ducks/_suite';
import * as CreatorV2 from '@/ducks/creatorV2';

import {
  ACTION_CONTEXT,
  MOCK_STATE,
  NODE_DATA,
  NODE_ID,
  NODE_PORT_REMAPS,
  NODE_PORT_REMAPS_STATE,
  PROJECT_META,
  REVERT_NODE_PORT_REMAPS_ACTION,
  SCHEMA_VERSION,
} from '../creator.fixture';

const { createState, describeReducer, describeReverter } = createDuckTools(CreatorV2, MOCK_STATE);

describe('Ducks | Creator V2 - transplantSteps reducer', () => {
  describeReducer(Realtime.node.transplantSteps, ({ applyAction }) => {
    const sourceParentNodeID = 'sourceParentNodeID';
    const targetParentNodeID = 'targetParentNodeID';
    const sourceBlockData = { ...NODE_DATA, nodeID: sourceParentNodeID };
    const targetBlockData = { ...NODE_DATA, nodeID: targetParentNodeID };

    it('ignore transplanting nodes for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        diagramID: 'foo',
        sourceParentNodeID: NODE_ID,
        targetParentNodeID: NODE_ID,
        stepIDs: [NODE_ID],
        index: 1,
        nodePortRemaps: [],
        removeNodes: [],
        removeSource: false,
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('ignore transplanting steps from unrecognized source block ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        sourceParentNodeID: 'foo',
        targetParentNodeID: NODE_ID,
        stepIDs: [NODE_ID],
        index: 1,
        nodePortRemaps: [],
        removeNodes: [],
        removeSource: false,
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('ignore transplanting steps to unrecognized target block ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        sourceParentNodeID: NODE_ID,
        targetParentNodeID: 'foo',
        stepIDs: [NODE_ID],
        index: 1,
        nodePortRemaps: [],
        removeNodes: [],
        removeSource: false,
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('ignore transplanting if any steps unrecognized', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        sourceParentNodeID: NODE_ID,
        targetParentNodeID: NODE_ID,
        stepIDs: [NODE_ID, 'foo'],
        index: 1,
        nodePortRemaps: [],
        removeNodes: [],
        removeSource: false,
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('transplant steps from one block to another', () => {
      const xStep = { ...NODE_DATA, nodeID: 'x' };
      const yStep = { ...NODE_DATA, nodeID: 'y' };
      const state = {
        ...MOCK_STATE,
        nodes: normalize([sourceBlockData, targetBlockData, xStep, yStep], (node) => node.nodeID),
        stepIDsByParentNodeID: {
          [sourceParentNodeID]: ['foo', xStep.nodeID, yStep.nodeID, 'bar'],
          [targetParentNodeID]: ['fizz', 'buzz'],
        },
      };

      const result = applyAction(state, {
        ...ACTION_CONTEXT,
        sourceParentNodeID,
        targetParentNodeID,
        stepIDs: [xStep.nodeID, yStep.nodeID],
        index: 1,
        nodePortRemaps: [],
        removeNodes: [],
        removeSource: false,
      });

      expect(result.stepIDsByParentNodeID).toEqual({
        [sourceParentNodeID]: ['foo', 'bar'],
        [targetParentNodeID]: ['fizz', xStep.nodeID, yStep.nodeID, 'buzz'],
      });
    });

    it('delete the source block if all steps transplanted', () => {
      const stepData = { ...NODE_DATA, nodeID: 'stepID' };
      const state = {
        ...MOCK_STATE,
        nodes: normalize([sourceBlockData, targetBlockData, stepData], (node) => node.nodeID),
        stepIDsByParentNodeID: {
          [sourceParentNodeID]: [stepData.nodeID],
          [targetParentNodeID]: ['fizz', 'buzz'],
        },
      };

      const result = applyAction(state, {
        ...ACTION_CONTEXT,
        sourceParentNodeID,
        targetParentNodeID,
        stepIDs: [stepData.nodeID],
        index: 1,
        removeNodes: [],
        nodePortRemaps: [],
        removeSource: false,
      });

      expect(result.nodes).toEqual(normalize([targetBlockData, stepData], (node) => node.nodeID));
    });
  });

  describeReverter(Realtime.node.transplantSteps, ({ revertAction }) => {
    it('registers an transplant action reverter', () => {
      const sourceParentNodeID = 'sourceParentNodeID';
      const targetParentNodeID = 'targetParentNodeID';
      const fooStepID = 'fooStepID';
      const barStepID = 'barStepID';
      const rootState = createState({
        ...MOCK_STATE,
        stepIDsByParentNodeID: { [sourceParentNodeID]: ['first', fooStepID, barStepID, 'fourth'] },
      });

      const result = revertAction(rootState, {
        ...ACTION_CONTEXT,
        sourceParentNodeID,
        targetParentNodeID,
        stepIDs: [fooStepID, barStepID],
        removeSource: false,
        index: 3,
        removeNodes: [],
      });

      expect(result).toEqual([
        Realtime.node.transplantSteps({
          ...ACTION_CONTEXT,
          sourceParentNodeID: targetParentNodeID,
          targetParentNodeID: sourceParentNodeID,
          stepIDs: [fooStepID, barStepID],
          removeSource: false,
          nodePortRemaps: [],
          index: 1,
          removeNodes: [],
        }),
      ]);
    });

    it('registers an isolate action reverter', () => {
      const sourceParentNodeID = 'sourceParentNodeID';
      const sourceBlockInPortID = 'sourceNodeIDInPortID';
      const targetParentNodeID = 'targetParentNodeID';
      const fooStepID = 'fooStepID';
      const barStepID = 'barStepID';
      const sourceBlockCoords: Realtime.Point = [100, 100];
      const sourceBlockName = 'sourceBlock';
      const rootState = createState({
        ...MOCK_STATE,
        stepIDsByParentNodeID: { [sourceParentNodeID]: ['first', fooStepID, barStepID, 'fourth'] },
        coordsByNodeID: { [sourceParentNodeID]: sourceBlockCoords },
        portsByNodeID: {
          [sourceParentNodeID]: { in: [sourceBlockInPortID], out: Realtime.Utils.port.createEmptyNodeOutPorts() },
        },
        nodes: normalize([
          {
            id: sourceParentNodeID,
            type: BlockType.COMBINED,
            nodeID: sourceParentNodeID,
            name: sourceBlockName,
          },
        ]),
      });

      const result = revertAction(rootState, {
        ...ACTION_CONTEXT,
        sourceParentNodeID,
        targetParentNodeID,
        stepIDs: [fooStepID, barStepID],
        removeSource: true,
        index: 3,
        removeNodes: [],
        nodePortRemaps: [],
      });

      expect(result).toEqual([
        Realtime.node.isolateSteps({
          ...ACTION_CONTEXT,
          schemaVersion: SCHEMA_VERSION,
          projectMeta: PROJECT_META,
          sourceParentNodeID: targetParentNodeID,
          parentNodeID: sourceParentNodeID,
          parentNodeData: {
            name: sourceBlockName,
            type: BlockType.COMBINED,
            ports: { in: [{ id: sourceBlockInPortID }], out: Realtime.Utils.port.createEmptyNodeOutPorts() },
            coords: sourceBlockCoords,
          },
          stepIDs: [fooStepID, barStepID],
        }),
      ]);
    });

    it('registers an link action reverter', () => {
      const sourceParentNodeID = 'sourceParentNodeID';
      const targetParentNodeID = 'targetParentNodeID';
      const fooStepID = 'fooStepID';
      const barStepID = 'barStepID';
      const rootState = createState({
        ...MOCK_STATE,
        ...NODE_PORT_REMAPS_STATE,
        stepIDsByParentNodeID: { [sourceParentNodeID]: ['first', fooStepID, barStepID, 'fourth'] },
      });

      const result = revertAction(rootState, {
        ...ACTION_CONTEXT,
        sourceParentNodeID,
        targetParentNodeID,
        stepIDs: [fooStepID, barStepID],
        removeSource: false,
        index: 3,
        nodePortRemaps: NODE_PORT_REMAPS,
        removeNodes: [],
      });
      const linkResult = (Array.isArray(result) ? result : [])[1];

      expect(linkResult).toEqual(REVERT_NODE_PORT_REMAPS_ACTION);
    });
  });
});
