import { generate } from '@voiceflow/ui';
import axios from 'axios';

import client from '@/client/file';

import suite from './_suite';

suite('Client - File', ({ expect, stub }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['uploadAudio', 'uploadImage']);
  });

  describe('uploadAudio()', () => {
    it('should generate a URL for uploaded audio data', async () => {
      const url = generate.string();
      const formData = new FormData();
      const axiosPost = stub(axios, 'post').resolves({ data: url });

      const { data } = await client.uploadAudio('audio', formData);

      expect(data).to.eq(url);
      expect(axiosPost).to.be.calledWithExactly('/audio', formData);
    });
  });

  describe('uploadImage()', () => {
    const url = generate.string();
    const formData = new FormData();

    it('should generate a URL for uploaded image', async () => {
      const axiosPost = stub(axios, 'post').resolves({ data: url });

      const { data } = await client.uploadImage(null, formData);

      expect(data).to.eq(url);
      expect(axiosPost).to.be.calledWithExactly('/image', formData);
    });

    it('should generate a URL for uploaded image with custom endpoint', async () => {
      const axiosPost = stub(axios, 'post').resolves({ data: url });

      const { data } = await client.uploadImage('/avatar', formData);

      expect(data).to.eq(url);
      expect(axiosPost).to.be.calledWithExactly('/avatar', formData);
    });
  });
});
