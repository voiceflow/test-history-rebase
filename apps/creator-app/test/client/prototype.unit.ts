import { Utils } from '@voiceflow/common';
import axios from 'axios';

import client from '@/client/prototype';
import { GENERAL_RUNTIME_ENDPOINT } from '@/config';

import suite from './_suite';

const VERSION_ID = Utils.generate.id();

suite('Client - Prototype', ({ expectMembers }) => {
  it('have expected keys', () => {
    expectMembers(Object.keys(client), ['interact']);
  });

  describe('interact()', () => {
    it('should interact with a prototype', async () => {
      const data: any = Utils.generate.object();
      const response = new Blob();
      const axiosPost = vi.spyOn(axios, 'post').mockResolvedValue({ data: response });

      expect(await client.interact(VERSION_ID, data)).toEqual(response);

      expect(axiosPost).toBeCalledWith(`${GENERAL_RUNTIME_ENDPOINT}/interact/${VERSION_ID}`, data, { headers: {} });
    });

    it('should interact with a prototype with a session ID', async () => {
      const data: any = Utils.generate.object();
      const sessionID = Utils.generate.id();
      const response = new Blob();
      const axiosPost = vi.spyOn(axios, 'post').mockResolvedValue({ data: response });

      expect(await client.interact(VERSION_ID, data, { sessionID })).toEqual(response);

      expect(axiosPost).toBeCalledWith(`${GENERAL_RUNTIME_ENDPOINT}/interact/${VERSION_ID}`, data, {
        headers: { sessionID },
      });
    });
  });
});
