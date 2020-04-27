import diagramAdapter from '@/client/adapters/diagram';
import client, { SKILL_PATH } from '@/client/skill';
import { generate } from '@/utils/testing';

import suite from './_suite';

const SKILL_ID = generate.id();

suite('Client - Skill', ({ expect, stubFetch, expectCall }) => {
  describe('get()', () => {
    it('should get a skill by ID', async () => {
      const skill = generate.object();
      const fetch = stubFetch().resolves(skill);

      await expectCall(client.get, SKILL_ID).toYield(skill);

      expect(fetch).to.be.calledWithExactly(`${SKILL_PATH}/${SKILL_ID}?simple=1&user_modules=1`);
    });
  });

  describe('update()', () => {
    it('should update a skill by ID', async () => {
      const skill = generate.object();
      const fetch = stubFetch('patch');

      await expectCall(client.update, SKILL_ID, skill).toYield();

      expect(fetch).to.be.calledWithExactly(`${SKILL_PATH}/${SKILL_ID}`, skill);
    });
  });

  describe('updateInvName()', () => {
    it('should update the invocation name', async () => {
      const name = generate.string();
      const fetch = stubFetch('patch');

      await expectCall(client.updateInvName, SKILL_ID, name).toYield();

      expect(fetch).to.be.calledWithExactly(`${SKILL_PATH}/${SKILL_ID}?inv_name=1`, { inv_name: name });
    });
  });

  describe('updateAccountLinking()', () => {
    it('should update the account linking', async () => {
      const accountLinking: any = generate.object();
      const fetch = stubFetch('post');

      await expectCall(client.updateAccountLinking, SKILL_ID, accountLinking).toYield();

      expect(fetch).to.be.calledWithExactly(`link_account/template/${SKILL_ID}`, accountLinking);
    });
  });

  describe('findDiagrams()', () => {
    it('should find all diagrams', async () => {
      const diagrams: any[] = generate.array(3, generate.object);
      const fetch = stubFetch().resolves(diagrams);

      await expectCall(client.findDiagrams, SKILL_ID).withListAdapter(diagramAdapter, diagrams).toYield();

      expect(fetch).to.be.calledWithExactly(`${SKILL_PATH}/${SKILL_ID}/diagrams`);
    });
  });
});
