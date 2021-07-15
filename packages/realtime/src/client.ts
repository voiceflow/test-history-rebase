import axios from 'axios';

import { Config } from './types';

const client = (config: Config) => ({
  workspace: {
    canRead: async (creatorID: number, workspaceID: string) => {
      try {
        await axios.head(`${config.CREATOR_API_ENDPOINT}/v2/user/${creatorID}/workspaces/${workspaceID}`);
        return true;
      } catch {
        return false;
      }
    },
  },
  project: {
    canRead: async (creatorID: number, projectID: string) => {
      try {
        await axios.head(`${config.CREATOR_API_ENDPOINT}/v2/user/${creatorID}/projects/${projectID}`);
        return true;
      } catch (err) {
        return false;
      }
    },
  },
  version: {
    canRead: async (creatorID: number, versionID: string) => {
      try {
        await axios.head(`${config.CREATOR_API_ENDPOINT}/v2/user/${creatorID}/versions/${versionID}`);
        return true;
      } catch {
        return false;
      }
    },
  },
  diagram: {
    canRead: async (creatorID: number, diagramID: string) => {
      try {
        await axios.head(`${config.CREATOR_API_ENDPOINT}/v2/user/${creatorID}/diagrams/${diagramID}`);
        return true;
      } catch {
        return false;
      }
    },
  },
});

export default client;
