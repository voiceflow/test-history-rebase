import * as Realtime from '@voiceflow/realtime-sdk';

import { ExtraOptions } from './types';

export interface DiagramClient {
  canRead: (creatorID: number, diagramID: string) => Promise<boolean>;

  patch: (diagramID: string, data: Partial<Realtime.Diagram>) => Promise<void>;
}

const Client = ({ api }: ExtraOptions): DiagramClient => ({
  canRead: (creatorID, diagramID) =>
    api
      .head(`/v2/user/${creatorID}/diagrams/${diagramID}`)
      .then(() => true)
      .catch(() => false),

  patch: (diagramID, data) => api.patch(`/v3/diagrams/${diagramID}`, data),
});

export default Client;
