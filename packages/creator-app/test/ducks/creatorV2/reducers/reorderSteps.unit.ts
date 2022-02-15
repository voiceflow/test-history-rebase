import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import { ACTION_CONTEXT, MOCK_STATE, NODE_DATA, NODE_ID } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - reorderSteps reducer', ({ expect, describeReducerV2 }) => {
  describeReducerV2(Realtime.node.reorderSteps, ({ applyAction }) => {
    const blockID = 'blockID';
    const stepID = 'stepID';
    const blockData = { ...NODE_DATA, nodeID: blockID };
    const stepData = { ...NODE_DATA, nodeID: stepID };

    it('ignore reordering steps for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        diagramID: 'foo',
        blockID: NODE_ID,
        stepID: NODE_ID,
        index: 1,
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('ignore reordering step with unrecognized block ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        blockID: 'foo',
        stepID: NODE_ID,
        index: 1,
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('ignore reordering step with unrecognized ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        blockID: NODE_ID,
        stepID: 'foo',
        index: 1,
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('ignore reordering step from a different block', () => {
      const state = {
        ...MOCK_STATE,
        nodes: normalize([blockData, stepData], (node) => node.nodeID),
        stepIDsByBlockID: { [blockID]: ['foo'] },
      };

      const result = applyAction(state, {
        ...ACTION_CONTEXT,
        blockID,
        stepID,
        index: 1,
      });

      expect(result).to.eq(state);
    });

    it('reorder a step within a block', () => {
      const state = {
        ...MOCK_STATE,
        nodes: normalize([blockData, stepData], (node) => node.nodeID),
        stepIDsByBlockID: { [blockID]: ['fizz', 'foo', stepID, 'bar', 'buzz'] },
      };

      const result = applyAction(state, {
        ...ACTION_CONTEXT,
        blockID,
        stepID,
        index: 1,
      });

      expect(result.stepIDsByBlockID[blockID]).to.eql(['fizz', stepID, 'foo', 'bar', 'buzz']);
    });
  });
});
