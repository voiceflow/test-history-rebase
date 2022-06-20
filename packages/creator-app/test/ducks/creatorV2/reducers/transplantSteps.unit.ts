import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import { BlockType } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
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
  V2_FEATURE_STATE,
} from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - transplantSteps reducer', ({ expect, describeReducerV2, describeReverter, createState }) => {
  describeReducerV2(Realtime.node.transplantSteps, ({ applyAction }) => {
    const sourceBlockID = 'sourceBlockID';
    const targetBlockID = 'targetBlockID';
    const sourceBlockData = { ...NODE_DATA, nodeID: sourceBlockID };
    const targetBlockData = { ...NODE_DATA, nodeID: targetBlockID };

    it('ignore transplanting nodes for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        diagramID: 'foo',
        sourceBlockID: NODE_ID,
        targetBlockID: NODE_ID,
        stepIDs: [NODE_ID],
        index: 1,
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('ignore transplanting steps from unrecognized source block ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        sourceBlockID: 'foo',
        targetBlockID: NODE_ID,
        stepIDs: [NODE_ID],
        index: 1,
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('ignore transplanting steps to unrecognized target block ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        sourceBlockID: NODE_ID,
        targetBlockID: 'foo',
        stepIDs: [NODE_ID],
        index: 1,
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('ignore transplanting if any steps unrecognized', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        sourceBlockID: NODE_ID,
        targetBlockID: NODE_ID,
        stepIDs: [NODE_ID, 'foo'],
        index: 1,
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('transplant steps from one block to another', () => {
      const xStep = { ...NODE_DATA, nodeID: 'x' };
      const yStep = { ...NODE_DATA, nodeID: 'y' };
      const state = {
        ...MOCK_STATE,
        nodes: normalize([sourceBlockData, targetBlockData, xStep, yStep], (node) => node.nodeID),
        stepIDsByBlockID: {
          [sourceBlockID]: ['foo', xStep.nodeID, yStep.nodeID, 'bar'],
          [targetBlockID]: ['fizz', 'buzz'],
        },
      };

      const result = applyAction(state, {
        ...ACTION_CONTEXT,
        sourceBlockID,
        targetBlockID,
        stepIDs: [xStep.nodeID, yStep.nodeID],
        index: 1,
      });

      expect(result.stepIDsByBlockID).to.eql({
        [sourceBlockID]: ['foo', 'bar'],
        [targetBlockID]: ['fizz', xStep.nodeID, yStep.nodeID, 'buzz'],
      });
    });

    it('delete the source block if all steps transplanted', () => {
      const stepData = { ...NODE_DATA, nodeID: 'stepID' };
      const state = {
        ...MOCK_STATE,
        nodes: normalize([sourceBlockData, targetBlockData, stepData], (node) => node.nodeID),
        stepIDsByBlockID: {
          [sourceBlockID]: [stepData.nodeID],
          [targetBlockID]: ['fizz', 'buzz'],
        },
      };

      const result = applyAction(state, {
        ...ACTION_CONTEXT,
        sourceBlockID,
        targetBlockID,
        stepIDs: [stepData.nodeID],
        index: 1,
      });

      expect(result.nodes).to.eql(normalize([targetBlockData, stepData], (node) => node.nodeID));
    });
  });

  describeReverter(Realtime.node.transplantSteps, ({ revertAction }) => {
    it('registers an transplant action reverter', () => {
      const sourceBlockID = 'sourceBlockID';
      const targetBlockID = 'targetBlockID';
      const fooStepID = 'fooStepID';
      const barStepID = 'barStepID';
      const rootState = createState(
        { ...MOCK_STATE, stepIDsByBlockID: { [sourceBlockID]: ['first', fooStepID, barStepID, 'fourth'] } },
        V2_FEATURE_STATE
      );

      const result = revertAction(rootState, {
        ...ACTION_CONTEXT,
        sourceBlockID,
        targetBlockID,
        stepIDs: [fooStepID, barStepID],
        removeSource: false,
        index: 3,
      });

      expect(result).to.eql([
        Realtime.node.transplantSteps({
          ...ACTION_CONTEXT,
          sourceBlockID: targetBlockID,
          targetBlockID: sourceBlockID,
          stepIDs: [fooStepID, barStepID],
          removeSource: false,
          nodePortRemaps: [],
          index: 1,
        }),
      ]);
    });

    it('registers an isolate action reverter', () => {
      const sourceBlockID = 'sourceBlockID';
      const sourceBlockInPortID = 'sourceBlockIDInPortID';
      const targetBlockID = 'targetBlockID';
      const fooStepID = 'fooStepID';
      const barStepID = 'barStepID';
      const sourceBlockCoords: Realtime.Point = [100, 100];
      const sourceBlockName = 'sourceBlock';
      const rootState = createState(
        {
          ...MOCK_STATE,
          stepIDsByBlockID: { [sourceBlockID]: ['first', fooStepID, barStepID, 'fourth'] },
          coordsByNodeID: { [sourceBlockID]: sourceBlockCoords },
          portsByNodeID: { [sourceBlockID]: { in: [sourceBlockInPortID], out: Realtime.Utils.port.createEmptyNodeOutPorts() } },
          nodes: normalize([
            {
              id: sourceBlockID,
              type: BlockType.COMBINED,
              nodeID: sourceBlockID,
              name: sourceBlockName,
            },
          ]),
        },
        V2_FEATURE_STATE
      );

      const result = revertAction(rootState, {
        ...ACTION_CONTEXT,
        sourceBlockID,
        targetBlockID,
        stepIDs: [fooStepID, barStepID],
        removeSource: true,
        index: 3,
        nodePortRemaps: [],
      });

      expect(result).to.eql([
        Realtime.node.isolateSteps({
          ...ACTION_CONTEXT,
          sourceBlockID: targetBlockID,
          blockID: sourceBlockID,
          blockCoords: sourceBlockCoords,
          blockName: sourceBlockName,
          blockPorts: { in: [{ id: sourceBlockInPortID }], out: Realtime.Utils.port.createEmptyNodeOutPorts() },
          projectMeta: PROJECT_META,
          schemaVersion: SCHEMA_VERSION,
          stepIDs: [fooStepID, barStepID],
        }),
      ]);
    });

    it('registers an link action reverter', () => {
      const sourceBlockID = 'sourceBlockID';
      const targetBlockID = 'targetBlockID';
      const fooStepID = 'fooStepID';
      const barStepID = 'barStepID';
      const rootState = createState(
        {
          ...MOCK_STATE,
          ...NODE_PORT_REMAPS_STATE,
          stepIDsByBlockID: { [sourceBlockID]: ['first', fooStepID, barStepID, 'fourth'] },
        },
        V2_FEATURE_STATE
      );

      const result = revertAction(rootState, {
        ...ACTION_CONTEXT,
        sourceBlockID,
        targetBlockID,
        stepIDs: [fooStepID, barStepID],
        removeSource: false,
        index: 3,
        nodePortRemaps: NODE_PORT_REMAPS,
      });
      const linkResult = (Array.isArray(result) ? result : [])[1];

      expect(linkResult).to.eql(REVERT_NODE_PORT_REMAPS_ACTION);
    });
  });
});
