import * as Realtime from '@voiceflow/realtime-sdk';
import { COLOR_PICKER_CONSTANTS } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { normalize } from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import { ACTION_CONTEXT, MOCK_STATE, NODE_DATA, NODE_ID } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - isolateStep reducer', ({ expect, describeReducerV2 }) => {
  describeReducerV2(Realtime.node.isolateStep, ({ applyAction }) => {
    const sourceBlockID = 'sourceBlockID';
    const blockID = 'blockID';
    const stepID = 'stepID';
    const blockCoords: Realtime.Point = [-90, 20];
    const blockName = 'New Block';

    it('ignore isolating step for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        diagramID: 'foo',
        sourceBlockID: NODE_ID,
        blockID,
        blockName,
        blockPorts: Realtime.Utils.port.createEmptyNodePorts(),
        blockCoords,
        stepID,
        projectMeta: {
          platform: VoiceflowConstants.PlatformType.VOICEFLOW,
          type: VoiceflowConstants.ProjectType.CHAT,
        },
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('ignore isolating step with duplicate block ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        sourceBlockID: NODE_ID,
        blockID: NODE_ID,
        blockName,
        blockPorts: Realtime.Utils.port.createEmptyNodePorts(),
        blockCoords,
        stepID,
        projectMeta: {
          platform: VoiceflowConstants.PlatformType.VOICEFLOW,
          type: VoiceflowConstants.ProjectType.CHAT,
        },
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('ignore isolating step with unrecognized step ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        sourceBlockID: NODE_ID,
        blockID,
        blockName,
        blockPorts: Realtime.Utils.port.createEmptyNodePorts(),
        blockCoords,
        stepID,
        projectMeta: {
          platform: VoiceflowConstants.PlatformType.VOICEFLOW,
          type: VoiceflowConstants.ProjectType.CHAT,
        },
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('ignore isolating step from unrecognized source block ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        sourceBlockID,
        blockID,
        blockName,
        blockPorts: Realtime.Utils.port.createEmptyNodePorts(),
        blockCoords,
        stepID: NODE_ID,
        projectMeta: {
          platform: VoiceflowConstants.PlatformType.VOICEFLOW,
          type: VoiceflowConstants.ProjectType.CHAT,
        },
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
          sourceBlockID: NODE_ID,
          blockID,
          blockName,
          blockPorts: Realtime.Utils.port.createEmptyNodePorts(),
          blockCoords,
          stepID,
          projectMeta: {
            platform: VoiceflowConstants.PlatformType.VOICEFLOW,
            type: VoiceflowConstants.ProjectType.CHAT,
          },
        }
      );

      expect(result.blockIDs).to.eql([NODE_ID, blockID]);
      expect(result.nodes).to.containSubset(
        normalize(
          [
            NODE_DATA,
            stepNode,
            { type: Realtime.BlockType.COMBINED, blockColor: COLOR_PICKER_CONSTANTS.BLOCK_STANDARD_COLOR, nodeID: blockID, name: blockName },
          ],
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
