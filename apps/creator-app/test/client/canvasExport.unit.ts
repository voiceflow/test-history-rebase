import { Utils } from '@voiceflow/common';
import axios from 'axios';

import client from '@/client/canvasExport';
import { CANVAS_EXPORT_ENDPOINT } from '@/config';

import suite from './_suite';

suite('Client - Canvas Export', ({ expectMembers }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), ['toPNG', 'toPDF']);
  });

  describe('toPNG()', () => {
    it('should generate a PNG', async () => {
      const token = 'token';
      const data: any = Utils.generate.object();
      const response = new Blob();
      const axiosPost = vi.spyOn(axios, 'post').mockResolvedValue({ data: response });

      expect(await client.toPNG({ token, ...data })).toEqual(response);

      expect(axiosPost).toBeCalledWith(`${CANVAS_EXPORT_ENDPOINT}/export/to-png`, data, {
        responseType: 'blob',
        headers: { authorization: token },
      });
    });
  });

  describe('toPDF()', () => {
    it('should generate a PDF', async () => {
      const token = 'token';
      const data = Utils.generate.object() as any;
      const response = new Blob();
      const axiosPost = vi.spyOn(axios, 'post').mockResolvedValue({ data: response });

      expect(await client.toPDF({ token, ...data })).toEqual(response);

      expect(axiosPost).toBeCalledWith(`${CANVAS_EXPORT_ENDPOINT}/export/to-pdf`, data, {
        responseType: 'blob',
        headers: { authorization: token },
      });
    });
  });
});
