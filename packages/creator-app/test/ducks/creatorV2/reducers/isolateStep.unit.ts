import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import { BlockVariant } from '@/constants/canvas';
import * as CreatorV2 from '@/ducks/creatorV2';
import { createEmptyNodePorts } from '@/ducks/creatorV2/utils';

import suite from '../../_suite';
import { ACTION_CONTEXT, MOCK_STATE, NODE_DATA, NODE_ID } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - isolateStep reducer', ({ expect, describeReducerV2 }) => {
  describeReducerV2(Realtime.node.isolateStep, ({ applyAction }) => {
    const blockID = 'blockID';
    const stepID = 'stepID';
    const blockOrigin: Realtime.Point = [-90, 20];

    it('ignore isolating step for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        diagramID: 'foo',
        blockID,
        blockPorts: createEmptyNodePorts(),
        blockOrigin,
        stepID,
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('ignore isolating step with duplicate block ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        blockID: NODE_ID,
        blockPorts: createEmptyNodePorts(),
        blockOrigin,
        stepID,
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('ignore isolating step with unrecognized step ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        blockID,
        blockPorts: createEmptyNodePorts(),
        blockOrigin,
        stepID,
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('isolate a step from its block', () => {
      const stepNode = { ...NODE_DATA, nodeID: stepID };

      const result = applyAction(
        {
          ...MOCK_STATE,
          blockIDs: [NODE_ID],
          nodes: normalize([NODE_DATA, stepNode], (node) => node.nodeID),
          blockIDByStepID: { [stepID]: NODE_ID },
          stepIDsByBlockID: { [NODE_ID]: ['fooStep', stepID, 'barStep'] },
        },
        {
          ...ACTION_CONTEXT,
          blockID,
          blockPorts: createEmptyNodePorts(),
          blockOrigin,
          stepID,
        }
      );

      expect(result.blockIDs).to.eql([NODE_ID, blockID]);
      expect(result.nodes).to.containSubset(
        normalize(
          [NODE_DATA, stepNode, { type: Realtime.BlockType.COMBINED, blockColor: BlockVariant.STANDARD, nodeID: blockID, name: 'Block' }],
          (node) => node.nodeID
        )
      );
      expect(result.blockIDByStepID).to.eql({ [stepID]: blockID });
      expect(result.stepIDsByBlockID).to.eql({
        [NODE_ID]: ['fooStep', 'barStep'],
        [blockID]: [stepID],
      });
    });
  });
});
