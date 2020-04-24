import displayAdapter from '@/client/adapters/display';
import client, { DISPLAY_PATH } from '@/client/display';
import { generate } from '@/utils/testing';

import suite from './_suite';

const DISPLAY_ID = generate.id();

suite('Client - Display', ({ expect, stubFetch, expectCall }) => {
  describe('delete()', () => {
    it('should delete a display by ID', async () => {
      const fetch = stubFetch('delete');

      await expectCall(client.delete, DISPLAY_ID).toYield();

      expect(fetch).to.be.calledWithExactly(`${DISPLAY_PATH}/${DISPLAY_ID}`);
    });
  });

  describe('getAll()', () => {
    it('should find all displays', async () => {
      const displays: any[] = generate.array(3, generate.object);
      const fetch = stubFetch().resolves(displays);

      await expectCall(client.getAll).withListAdapter(displayAdapter, displays).toYield();

      expect(fetch).to.be.calledWithExactly('multimodal/displays');
    });
  });

  describe('get()', () => {
    it('should get a display by ID', async () => {
      const display: any = generate.object();
      const fetch = stubFetch().resolves(display);

      await expectCall(client.get, DISPLAY_ID).withAdapter(displayAdapter, display).toYield();

      expect(fetch).to.be.calledWithExactly(`${DISPLAY_PATH}/${DISPLAY_ID}`);
    });
  });

  describe('update()', () => {
    it('should update a display by ID', async () => {
      const display: any = generate.object();
      const skillID = generate.id();
      const fetch = stubFetch('patch');

      await expectCall(client.update, DISPLAY_ID, skillID, display).toYield();

      expect(fetch).to.be.calledWithExactly(`${DISPLAY_PATH}/${DISPLAY_ID}?skill_id=${skillID}`, display);
    });
  });

  describe('create()', () => {
    it('should create a display ', async () => {
      const display: any = generate.object();
      const skillID = generate.id();
      const fetch = stubFetch('post').resolves(DISPLAY_ID);

      await expectCall(client.create, skillID, display).toYield(DISPLAY_ID);

      expect(fetch).to.be.calledWithExactly(`${DISPLAY_PATH}?skill_id=${skillID}`, display);
    });
  });
});
