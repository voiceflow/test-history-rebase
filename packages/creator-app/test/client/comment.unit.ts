import { Utils } from '@voiceflow/common';

import commentAdapter from '@/client/adapters/comment';
import client, { COMMENTING_PATH } from '@/client/comment';

import suite from './_suite';

const PROJECT_ID = Utils.generate.id();
const COMMENT_ID = Utils.generate.id();

suite('Client - Comment', ({ expect, stubFetch, stubAdapter }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['delete', 'create', 'update']);
  });

  describe('delete()', () => {
    it('delete comment', async () => {
      const fetch = stubFetch('api', 'delete');

      await client.delete(PROJECT_ID, COMMENT_ID);

      expect(fetch).to.be.calledWithExactly(`${COMMENTING_PATH}/${PROJECT_ID}/comment/${COMMENT_ID}`);
    });
  });

  describe('update()', () => {
    it('update comment', async () => {
      const data: any = Utils.generate.object();
      const [dbComment, toDB] = stubAdapter(commentAdapter, 'toDB', Utils.generate.object);
      const fetch = stubFetch('api', 'put');

      await client.update(PROJECT_ID, COMMENT_ID, data);

      expect(fetch).to.be.calledWithExactly(`${COMMENTING_PATH}/${PROJECT_ID}/comment/${COMMENT_ID}`, dbComment);
      expect(toDB).to.be.calledWithExactly(data);
    });
  });

  describe('create()', () => {
    it('create comment', async () => {
      const threadID = Utils.generate.string();
      const data: any = Utils.generate.object();
      const commentResponse = Utils.generate.object();
      const [dbComment, toDB] = stubAdapter(commentAdapter, 'toDB', Utils.generate.object);
      const [comment, fromDB] = stubAdapter(commentAdapter, 'fromDB', Utils.generate.object);
      const fetch = stubFetch('api', 'post').resolves(commentResponse);

      const result = await client.create(PROJECT_ID, threadID, data);

      expect(result).to.eq(comment);
      expect(fetch).to.be.calledWithExactly(`${COMMENTING_PATH}/${PROJECT_ID}/threads/${threadID}`, dbComment);
      expect(toDB).to.be.calledWithExactly(data);
      expect(fromDB).to.be.calledWithExactly(commentResponse);
    });
  });
});
