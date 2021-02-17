import fetch from './fetch';

const featureClient = {
  getStatuses: () => fetch.get<Record<string, { isEnabled: boolean }>>('features/status'),
};

export default featureClient;
