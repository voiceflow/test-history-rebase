import { Workspace } from '@/models';

import { api } from './fetch';

export const ANALYTICS_PATH = 'analytics';

const analyticsClient = {
  track: <P extends {}, K extends keyof P>(
    event: string,
    { hashed, teamhashed, properties = {} as P }: { hashed?: K[]; teamhashed?: K[]; properties?: P } = {}
  ) => {
    api.post(`${ANALYTICS_PATH}/track`, {
      event,
      hashed,
      teamhashed,
      properties,
    });
  },

  identify: <T extends {}, K extends keyof T>({ traits, hashed, teamhashed }: { traits: T; hashed?: K[]; teamhashed?: K[] }) => {
    api.post(`${ANALYTICS_PATH}/identify`, { traits, hashed, teamhashed });
  },

  identifyWorkspace: (workspace: Workspace) => {
    api.post(`${ANALYTICS_PATH}/workspace/identify`, workspace);
  },
};

export default analyticsClient;
