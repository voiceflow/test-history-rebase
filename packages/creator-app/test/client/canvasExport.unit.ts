import { generate } from '@voiceflow/ui';
import axios from 'axios';

import client from '@/client/canvasExport';
import { CANVAS_EXPORT_ENDPOINT } from '@/config';

import suite from './_suite';

suite('Client - Canvas Export', ({ expect, stub }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members(['toPNG', 'toPDF']);
  });

  describe('toPNG()', () => {
    it('should generate a PNG', async () => {
      const data: any = generate.object();
      const response = new Blob();
      const axiosPost = stub(axios, 'post').resolves({ data: response });

      await expect(client.toPNG(data)).to.eventually.eq(response);

      expect(axiosPost).to.be.calledWithExactly(`${CANVAS_EXPORT_ENDPOINT}/export/to-png`, data, { responseType: 'blob' });
    });
  });

  describe('toPDF()', () => {
    it('should generate a PDF', async () => {
      const data: any = generate.object();
      const response = new Blob();
      const axiosPost = stub(axios, 'post').resolves({ data: response });

      await expect(client.toPDF(data)).to.eventually.eq(response);

      expect(axiosPost).to.be.calledWithExactly(`${CANVAS_EXPORT_ENDPOINT}/export/to-pdf`, data, { responseType: 'blob' });
    });
  });
});
