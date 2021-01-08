import * as LegacySkillAdapter from '@/client/adapters/legacy/skill';
import client, { LEGACY_TESTING_PATH, PROTOTYPE_PATH } from '@/client/prototype';
import { generate } from '@/utils/testing';

import suite from './_suite';

suite('Client - Prototype', ({ expect, stub, stubFetch, stubAdapter }) => {
  it('have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['interact', 'interactV2', 'getInfo', 'createInfo', 'getSpeakAudio', 'getLegacyInfo']);
  });

  describe('interact()', () => {
    it('send prototype interaction', async () => {
      const body: any = generate.object();
      const locale = generate.string();
      const fetch = stubFetch('api', 'post');

      await client.interact(body, locale);

      expect(fetch).to.be.calledWithExactly(`${PROTOTYPE_PATH}/interact?locale=${locale}`, body);
    });
  });

  describe('getInfo()', () => {
    it('get prototype info', async () => {
      const configID = generate.string();
      const dbSkill: any = generate.object();
      const globalVariables: any = generate.object();
      const legacyIntents = generate.array<any>();
      const legacySlots = generate.array<any>();
      const extractIntents = stub(LegacySkillAdapter, 'extractIntents').returns(legacyIntents);
      const extractSlots = stub(LegacySkillAdapter, 'extractSlots').returns(legacySlots);
      const [legacySkill, skillFromDB] = stubAdapter(LegacySkillAdapter.default, 'fromDB', generate.object);
      const fetch = stubFetch('api', 'get').resolves({ skill: dbSkill, globals: globalVariables });

      const result = await client.getInfo(configID);

      expect(result).to.eql({
        slots: legacySlots,
        intents: legacyIntents,
        skill: legacySkill,
        testVariableValues: globalVariables,
      });
      expect(fetch).to.be.calledWithExactly(`${LEGACY_TESTING_PATH}/getInfo/${configID}`);
      expect(skillFromDB).to.be.calledWithExactly(dbSkill);
      expect(extractIntents).to.be.calledWithExactly(dbSkill);
      expect(extractSlots).to.be.calledWithExactly(dbSkill);
    });
  });

  describe('createInfo()', () => {
    it('update prototype info', async () => {
      const versionID = generate.string();
      const diagramID = generate.string();
      const variables: any = generate.object();
      const fetch = stubFetch('apiV2', 'post');

      await client.createInfo(versionID, diagramID, variables);

      expect(fetch).to.be.calledWithExactly(`versions/${versionID}/test`, { diagramID, variables });
    });
  });

  describe('getSpeakAudio()', () => {
    it('render SSML as audio', async () => {
      const ssml = generate.string();
      const voice = generate.string();
      const fetch = stubFetch('api', 'post');

      await client.getSpeakAudio({ ssml, voice });

      expect(fetch).to.be.calledWithExactly(`${LEGACY_TESTING_PATH}/speak`, { ssml, voice });
    });
  });
});
