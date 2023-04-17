import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import { ACTION_CONTEXT, MOCK_STATE, NODE_ID } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - addMarkup reducer', ({ describeReducerV2 }) => {
  describeReducerV2(Realtime.node.addMarkup, ({ applyAction, normalizeContaining }) => {
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
          platform: Platform.Constants.PlatformType.VOICEFLOW,
          type: Platform.Constants.ProjectType.CHAT,
        },
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('ignore adding markup with duplicate ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        nodeID: NODE_ID,
        coords,
        data,
        projectMeta: {
          platform: Platform.Constants.PlatformType.VOICEFLOW,
          type: Platform.Constants.ProjectType.CHAT,
        },
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('add markup', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        nodeID: markupID,
        coords,
        data,
        projectMeta: {
          platform: Platform.Constants.PlatformType.VOICEFLOW,
          type: Platform.Constants.ProjectType.CHAT,
        },
      });

      expect(result.nodes).toEqual(normalizeContaining([{ ...data, nodeID: markupID }], (node) => node.nodeID));
      expect(result.markupIDs).toEqual([markupID]);
      expect(result.coordsByNodeID).toEqual({ [markupID]: coords });
    });
  });
});
