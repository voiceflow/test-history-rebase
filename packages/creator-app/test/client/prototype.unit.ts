import { Utils } from '@voiceflow/common';
import axios from 'axios';

import client from '@/client/prototype';
import { GENERAL_RUNTIME_ENDPOINT } from '@/config';

import suite from './_suite';

const VERSION_ID = Utils.generate.id();

suite('Client - Prototype', ({ expect, stub }) => {
  it('have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['interact']);
  });

  describe('interact()', () => {
    it('should interact with a prototype', async () => {
      const data: any = Utils.generate.object();
      const response = new Blob();
      const axiosPost = stub(axios, 'post').resolves({ data: response });

      await expect(client.interact(VERSION_ID, data)).to.eventually.eq(response);

      expect(axiosPost).to.be.calledWithExactly(`${GENERAL_RUNTIME_ENDPOINT}/interact/${VERSION_ID}`, data, { headers: {} });
    });

    it('should interact with a prototype with a session ID', async () => {
      const data: any = Utils.generate.object();
      const sessionID = Utils.generate.id();
      const response = new Blob();
      const axiosPost = stub(axios, 'post').resolves({ data: response });

      await expect(client.interact(VERSION_ID, data, { sessionID })).to.eventually.eq(response);

      expect(axiosPost).to.be.calledWithExactly(`${GENERAL_RUNTIME_ENDPOINT}/interact/${VERSION_ID}`, data, { headers: { sessionID } });
    });
  });
});
