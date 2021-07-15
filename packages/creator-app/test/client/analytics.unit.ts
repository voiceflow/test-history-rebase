import { generate } from '@voiceflow/ui';

import client, { ANALYTICS_PATH } from '@/client/analytics';

import suite from './_suite';

const EVENT = generate.string();

suite('Client - Analytics', ({ expect, stubFetch }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['track', 'identify', 'identifyWorkspace']);
  });

  describe('track()', () => {
    it('track event', () => {
      const fetch = stubFetch('apiV2', 'post');

      client.track(EVENT);

      expect(fetch).to.be.calledWithExactly(`${ANALYTICS_PATH}/track`, {
        event: EVENT,
        hashed: undefined,
        teamhashed: undefined,
        properties: {},
      });
    });
  });

  describe('identify()', () => {
    it('identify user', () => {
      const fetch = stubFetch('apiV2', 'post');
      const traits = generate.object();
      const hashed = generate.array(3);
      const teamhashed = generate.array(3);

      client.identify({ traits, hashed, teamhashed });

      expect(fetch).to.be.calledWithExactly(`${ANALYTICS_PATH}/identify`, { traits, hashed, teamhashed });
    });
  });

  describe('identifyWorkspace()', () => {
    it('identify workspace', () => {
      const fetch = stubFetch('apiV2', 'post');
      const workspace: any = generate.object();

      client.identifyWorkspace(workspace);

      expect(fetch).to.be.calledWithExactly(`${ANALYTICS_PATH}/workspace/identify`, workspace);
    });
  });
});
