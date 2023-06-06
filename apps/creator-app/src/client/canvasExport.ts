import axios from 'axios';

import { CANVAS_EXPORT_ENDPOINT } from '@/config';

interface Options {
  token: string;
  canvasURL: string;
}

const createCanvasExportEndpoint =
  (endpoint: string) =>
  ({ token, ...data }: Options): Promise<Blob> =>
    axios
      .post<Blob>(`${CANVAS_EXPORT_ENDPOINT}/export/${endpoint}`, data, { responseType: 'blob', headers: { authorization: token } })
      .then((response) => response.data);

const canvasExportClient = {
  toPNG: createCanvasExportEndpoint('to-png'),
  toPDF: createCanvasExportEndpoint('to-pdf'),
};

export default canvasExportClient;
