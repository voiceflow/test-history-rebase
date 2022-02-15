import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import { ACTION_CONTEXT, MOCK_STATE, NODE_DATA, NODE_ID } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - transplantSteps reducer', ({ expect, describeReducerV2 }) => {
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
});
