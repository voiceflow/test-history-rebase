import { Workspace } from '@/models';

import { apiV2 } from './fetch';

export const ANALYTICS_PATH = 'analytics';

const analyticsClient = {
  /**
   * use `project_id: true`, `workspace_id: true`, etc to inject private data on the backend
   */
  track: <P extends Record<string, any>, K extends keyof P>(
    event: string,
    { hashed, teamhashed, properties = {} as P }: { hashed?: K[]; teamhashed?: K[]; properties?: P } = {}
  ): void => {
    apiV2.post(`${ANALYTICS_PATH}/track`, { event, hashed, teamhashed, properties });
  },

  identify: <T extends {}, K extends keyof T>({ traits, hashed, teamhashed }: { traits: T; hashed?: K[]; teamhashed?: K[] }): void => {
    apiV2.post(`${ANALYTICS_PATH}/identify`, { traits, hashed, teamhashed });
  },

  identifyWorkspace: (workspace: Workspace): void => {
    apiV2.post(`${ANALYTICS_PATH}/workspace/identify`, workspace);
  },
};

export default analyticsClient;
