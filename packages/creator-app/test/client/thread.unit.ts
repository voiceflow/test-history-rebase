import { generate } from '@voiceflow/ui';

import threadAdapter from '@/client/adapters/thread';
import client, { COMMENTING_PATH } from '@/client/thread';

import suite from './_suite';

const PROJECT_ID = generate.id();

suite('Client - Thread', ({ expect, stubFetch, stubAdapter }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['find', 'get', 'create', 'update']);
  });

  describe('find()', () => {
    it('should find all project threads', async () => {
      const dbThreads = generate.array(3, generate.object);
      const fetch = stubFetch('api', 'get').resolves({ threads: dbThreads });
      const [threads, mapThreadsFromDB] = stubAdapter(threadAdapter, 'mapFromDB', () => generate.array(3, generate.object));

      await expect(client.find(PROJECT_ID)).to.eventually.eq(threads);

      expect(fetch).to.be.calledWithExactly(`${COMMENTING_PATH}/${PROJECT_ID}/threads`);
      expect(mapThreadsFromDB).to.be.calledWithExactly(dbThreads);
    });
  });

  describe('get()', () => {
    it('should get a thread by ID', async () => {
      const dbThread = generate.object();
      const threadID = generate.id();
      const fetch = stubFetch('api', 'get').resolves({ thread: dbThread });
      const [thread, threadFromDB] = stubAdapter(threadAdapter, 'fromDB', generate.object);

      await expect(client.get(PROJECT_ID, threadID)).to.eventually.eq(thread);

      expect(fetch).to.be.calledWithExactly(`${COMMENTING_PATH}/${PROJECT_ID}/threads/${threadID}`);
      expect(threadFromDB).to.be.calledWithExactly(dbThread);
    });
  });

  describe('create()', () => {
    it('should create a new thread', async () => {
      const dbThread = generate.object();
      const data: any = generate.object();
      const fetch = stubFetch('api', 'post').resolves(dbThread);
      const [thread, threadFromDB] = stubAdapter(threadAdapter, 'fromDB', generate.object);
      const [dbData, threadToDB] = stubAdapter(threadAdapter, 'toDB', generate.object);

      await expect(client.create(PROJECT_ID, data)).to.eventually.eq(thread);

      expect(fetch).to.be.calledWithExactly(`${COMMENTING_PATH}/${PROJECT_ID}/threads`, dbData);
      expect(threadFromDB).to.be.calledWithExactly(dbThread);
      expect(threadToDB).to.be.calledWithExactly(data);
    });
  });

  describe('update()', () => {
    it('should update an existing thread', async () => {
      const dbThread = generate.object();
      const data: any = generate.object();
      const threadID = generate.id();
      const fetch = stubFetch('api', 'put').resolves(dbThread);
      const [dbData, threadToDB] = stubAdapter(threadAdapter, 'toDB', () => ({
        resolved: true,
        deleted: false,
        node_id: generate.id(),
        position: generate.array(2, generate.number),
      }));

      await client.update(PROJECT_ID, threadID, data);

      expect(fetch).to.be.calledWithExactly(`${COMMENTING_PATH}/${PROJECT_ID}/threads/${threadID}`, dbData);
      expect(threadToDB).to.be.calledWithExactly(data);
    });
  });
});
