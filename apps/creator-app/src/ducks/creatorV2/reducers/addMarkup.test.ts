import * as Realtime from '@voiceflow/realtime-sdk';
import { describe, expect, it } from 'vitest';

import { createDuckTools } from '@/ducks/_suite';

import * as CreatorV2 from '..';
import { ACTION_CONTEXT, MOCK_STATE, NODE_ID, PROJECT_META, SCHEMA_VERSION } from '../creator.fixture';

const { describeReducer } = createDuckTools(CreatorV2, MOCK_STATE);

describe('Ducks | Creator V2 - addMarkup reducer', () => {
  describeReducer(Realtime.node.addMarkup, ({ applyAction, normalizeContaining }) => {
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
        schemaVersion: SCHEMA_VERSION,
        projectMeta: PROJECT_META,
        diagramID: 'foo',
        nodeID: markupID,
        coords,
        data,
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('ignore adding markup with duplicate ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        schemaVersion: SCHEMA_VERSION,
        projectMeta: PROJECT_META,
        nodeID: NODE_ID,
        coords,
        data,
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('add markup', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        schemaVersion: SCHEMA_VERSION,
        projectMeta: PROJECT_META,
        nodeID: markupID,
        coords,
        data,
      });

      expect(result.nodes).toEqual(normalizeContaining([{ ...data, nodeID: markupID }], (node) => node.nodeID));
      expect(result.markupIDs).toEqual([markupID]);
      expect(result.coordsByNodeID).toEqual({ [markupID]: coords });
    });
  });
});
