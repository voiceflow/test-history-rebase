import { Utils } from '@voiceflow/common';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';

import { GENERAL_RUNTIME_ENDPOINT } from '@/config';

import client from './prototype';

const VERSION_ID = Utils.generate.id();

describe('Client - Prototype', () => {
  it('have expected keys', () => {
    expect(Object.keys(client)).toEqual(expect.arrayContaining(['interact']));
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
