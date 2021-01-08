import client, { ANALYTICS_PATH } from '@/client/analytics';
import { generate } from '@/utils/testing';

import suite from './_suite';

const EVENT = generate.string();

suite('Client - Analytics', ({ expect, stubFetch }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['track', 'identify', 'identifyWorkspace']);
  });

  describe('track()', () => {
    it('track event', () => {
      const fetch = stubFetch('api', 'post');

      client.track(EVENT);

      expect(fetch).to.be.calledWithExactly(`${ANALYTICS_PATH}/track`, {
        event: EVENT,
        hashed: undefined,
        teamhashed: undefined,
        properties: {},
      });
    });
  });
});
