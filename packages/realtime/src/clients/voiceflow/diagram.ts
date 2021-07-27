import { ExtraOptions } from './types';

export interface DiagramClient {
  canRead: (creatorID: number, diagramID: string) => Promise<boolean>;
}

const Client = ({ axiosClient }: ExtraOptions): DiagramClient => ({
  canRead: (creatorID: number, diagramID: string) =>
    axiosClient
      .head(`/v2/user/${creatorID}/diagrams/${diagramID}`)
      .then(() => true)
      .catch(() => false),
});

export default Client;
