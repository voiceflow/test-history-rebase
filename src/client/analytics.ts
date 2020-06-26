import { Workspace } from '@/models';

import fetch from './fetch';

const ANALYTICS_PATH = 'analytics';

const analyticsClient = {
  track: <P extends {}, K extends keyof P>(
    event: string,
    { hashed, teamhashed, properties = {} as P }: { hashed?: K[]; teamhashed?: K[]; properties?: P } = {}
  ) => {
    fetch.post(`${ANALYTICS_PATH}/track`, {
      event,
      hashed,
      teamhashed,
      properties,
    });
  },

  identify: <T extends {}, K extends keyof T>({ traits, hashed, teamhashed }: { traits: T; hashed?: K[]; teamhashed?: K[] }) => {
    fetch.post(`${ANALYTICS_PATH}/identify`, { traits, hashed, teamhashed });
  },

  identifyWorkspace: (workspace: Workspace) => {
    fetch.post(`${ANALYTICS_PATH}/workspace/identify`, workspace);
  },
};

export default analyticsClient;
