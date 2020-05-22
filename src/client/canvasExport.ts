import axios from 'axios';

import { CANVAS_EXPORT_ENDPOINT } from '@/config';

type Options = {
  token: string;
  canvasURL: string;
  persistedToken: string;
  persistedTabID: string;
  persistedBrowserID: string;
};

const canvasExportClient = {
  toPNG: (data: Options) =>
    axios
      .post<Blob>(`${CANVAS_EXPORT_ENDPOINT}/export/to-png`, data, { responseType: 'blob' })
      .then((response) => response.data),

  toPDF: (data: Options) =>
    axios
      .post<Blob>(`${CANVAS_EXPORT_ENDPOINT}/export/to-pdf`, data, { responseType: 'blob' })
      .then((response) => response.data),
};

export default canvasExportClient;
