import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { normalize } from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import { ACTION_CONTEXT, MOCK_STATE, NODE_ID } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - addMarkup reducer', ({ expect, describeReducerV2 }) => {
  describeReducerV2(Realtime.node.addMarkup, ({ applyAction }) => {
    const markupID = 'markupNode';
    const coords: Realtime.Point = [100, 200];
    const data = {
      type: Realtime.BlockType.MARKUP_IMAGE,
      name: 'node name',
      url: 'http://example.com/image.png',
      width: 50,
      height: 150,
      rotate: 20,
    };

    it('ignore adding markup for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        diagramID: 'foo',
        nodeID: markupID,
        coords,
        data,
        projectMeta: {
          platform: VoiceflowConstants.PlatformType.VOICEFLOW,
          type: VoiceflowConstants.ProjectType.CHAT,
        },
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('ignore adding markup with duplicate ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        nodeID: NODE_ID,
        coords,
        data,
        projectMeta: {
          platform: VoiceflowConstants.PlatformType.VOICEFLOW,
          type: VoiceflowConstants.ProjectType.CHAT,
        },
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('add markup', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        nodeID: markupID,
        coords,
        data,
        projectMeta: {
          platform: VoiceflowConstants.PlatformType.VOICEFLOW,
          type: VoiceflowConstants.ProjectType.CHAT,
        },
      });

      expect(result.nodes).to.containSubset(normalize([{ ...data, nodeID: markupID }], (node) => node.nodeID));
      expect(result.markupIDs).to.eql([markupID]);
      expect(result.coordsByNodeID).to.eql({ [markupID]: coords });
    });
  });
});
