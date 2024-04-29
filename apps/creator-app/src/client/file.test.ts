import { Utils } from '@voiceflow/common';
import axios from 'axios';

import client from '@/client/file';

import suite from './_suite';

suite('Client - File', ({ expectMembers }) => {
  class FormData {}

  it('should have expected keys', () => {
    expectMembers(Object.keys(client), ['uploadAudio', 'uploadImage']);
  });

  describe('uploadAudio()', () => {
    it('should generate a URL for uploaded audio data', async () => {
      const url = Utils.generate.string();
      const formData = new FormData();
      const axiosPost = vi.spyOn(axios, 'post').mockResolvedValue({ data: url });

      const { data } = await client.uploadAudio(formData as any);

      expect(data).toEqual(url);
      expect(axiosPost).toBeCalledWith('/audio', formData);
    });
  });

  describe('uploadImage()', () => {
    const url = Utils.generate.string();
    const formData = new FormData();

    it('should generate a URL for uploaded image', async () => {
      const axiosPost = vi.spyOn(axios, 'post').mockResolvedValue({ data: url });

      const { data } = await client.uploadImage(null, formData as any);

      expect(data).toEqual(url);
      expect(axiosPost).toBeCalledWith('/image', formData);
    });

    it('should generate a URL for uploaded image with custom endpoint', async () => {
      const axiosPost = vi.spyOn(axios, 'post').mockResolvedValue({ data: url });

      const { data } = await client.uploadImage('/avatar', formData as any);

      expect(data).toEqual(url);
      expect(axiosPost).toBeCalledWith('/avatar', formData);
    });
  });
});
