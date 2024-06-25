import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import {
  ACTION_CONTEXT,
  MOCK_STATE,
  NODE_DATA,
  NODE_ID,
  NODE_PORT_REMAPS,
  NODE_PORT_REMAPS_STATE,
  REVERT_NODE_PORT_REMAPS_ACTION,
} from '../_fixtures';

suite(CreatorV2, MOCK_STATE)(
  'Ducks | Creator V2 - reorderSteps reducer',
  ({ describeReducerV2, describeReverter, createState }) => {
    describeReducerV2(Realtime.node.reorderSteps, ({ applyAction }) => {
      const parentNodeID = 'parentNodeID';
      const stepID = 'stepID';
      const blockData = { ...NODE_DATA, nodeID: parentNodeID };
      const stepData = { ...NODE_DATA, nodeID: stepID };

      it('ignore reordering steps for a different diagram', () => {
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          diagramID: 'foo',
          parentNodeID: NODE_ID,
          stepID: NODE_ID,
          index: 1,
          removeNodes: [],
        });

        expect(result).toBe(MOCK_STATE);
      });

      it('ignore reordering step with unrecognized block ID', () => {
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          parentNodeID: 'foo',
          stepID: NODE_ID,
          index: 1,
          removeNodes: [],
        });

        expect(result).toBe(MOCK_STATE);
      });

      it('ignore reordering step with unrecognized ID', () => {
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          parentNodeID: NODE_ID,
          stepID: 'foo',
          index: 1,
          removeNodes: [],
        });

        expect(result).toBe(MOCK_STATE);
      });

      it('ignore reordering step from a different block', () => {
        const state = {
          ...MOCK_STATE,
          nodes: normalize([blockData, stepData], (node) => node.nodeID),
          stepIDsByParentNodeID: { [parentNodeID]: ['foo'] },
        };

        const result = applyAction(state, {
          ...ACTION_CONTEXT,
          parentNodeID,
          stepID,
          index: 1,
          removeNodes: [],
        });

        expect(result).toEqual(state);
      });

      it('reorder a step within a block', () => {
        const state = {
          ...MOCK_STATE,
          nodes: normalize([blockData, stepData], (node) => node.nodeID),
          stepIDsByParentNodeID: { [parentNodeID]: ['fizz', 'foo', stepID, 'bar', 'buzz'] },
        };

        const result = applyAction(state, {
          ...ACTION_CONTEXT,
          parentNodeID,
          stepID,
          index: 1,
          removeNodes: [],
        });

        expect(result.stepIDsByParentNodeID[parentNodeID]).toEqual(['fizz', stepID, 'foo', 'bar', 'buzz']);
      });
    });

    describeReverter(Realtime.node.reorderSteps, ({ revertAction }) => {
      it('registers an action reverter', () => {
        const parentNodeID = 'parentNodeID';
        const stepID = 'stepID';
        const rootState = createState({
          ...MOCK_STATE,
          ...NODE_PORT_REMAPS_STATE,
          stepIDsByParentNodeID: { [parentNodeID]: ['first', stepID, 'third', 'fourth'] },
        });

        const result = revertAction(rootState, {
          ...ACTION_CONTEXT,
          parentNodeID,
          stepID,
          index: 2,
          nodePortRemaps: NODE_PORT_REMAPS,
          removeNodes: [],
        });

        expect(result).toEqual([
          Realtime.node.reorderSteps({
            ...ACTION_CONTEXT,
            parentNodeID,
            stepID,
            index: 1,
            nodePortRemaps: [],
            removeNodes: [],
          }),
          REVERT_NODE_PORT_REMAPS_ACTION,
        ]);
      });
    });
  }
);
