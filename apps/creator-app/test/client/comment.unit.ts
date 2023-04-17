import { Utils } from '@voiceflow/common';
import { Adapters } from '@voiceflow/realtime-sdk';

import client, { COMMENTING_PATH } from '@/client/comment';

import suite from './_suite';

const PROJECT_ID = Utils.generate.id();
const COMMENT_ID = Utils.generate.id();

suite('Client - Comment', ({ expectMembers, stubFetch, stubAdapter }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), ['delete', 'create', 'update']);
  });

  describe('delete()', () => {
    it('delete comment', async () => {
      const fetch = stubFetch('api', 'delete');

      await client.delete(PROJECT_ID, COMMENT_ID);

      expect(fetch).toBeCalledWith(`${COMMENTING_PATH}/${PROJECT_ID}/comment/${COMMENT_ID}`);
    });
  });

  describe('update()', () => {
    it('update comment', async () => {
      const data: any = Utils.generate.object();
      const [dbComment, toDB] = stubAdapter(Adapters.commentAdapter, 'toDB', Utils.generate.object);
      const fetch = stubFetch('api', 'put');

      await client.update(PROJECT_ID, COMMENT_ID, data);

      expect(fetch).toBeCalledWith(`${COMMENTING_PATH}/${PROJECT_ID}/comment/${COMMENT_ID}`, dbComment);
      expect(toDB).toBeCalledWith(data);
    });
  });

  describe('create()', () => {
    it('create comment', async () => {
      const threadID = Utils.generate.string();

      const data: any = Utils.generate.object();

      const commentResponse = Utils.generate.object();

      const [dbComment, toDB] = stubAdapter(Adapters.commentAdapter, 'toDB', Utils.generate.object);
      const [comment, fromDB] = stubAdapter(Adapters.commentAdapter, 'fromDB', Utils.generate.object);
      const fetch = stubFetch('api', 'post').mockResolvedValue(commentResponse);

      const result = await client.create(PROJECT_ID, threadID, data);

      expect(result).toEqual(comment);
      expect(fetch).toBeCalledWith(`${COMMENTING_PATH}/${PROJECT_ID}/threads/${threadID}`, dbComment);
      expect(toDB).toBeCalledWith(data);
      expect(fromDB).toBeCalledWith(commentResponse);
    });
  });
});
