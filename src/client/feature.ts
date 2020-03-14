import fetch from './fetch';

const featureClient = {
  isEnabled: (featureID: string) => fetch.get<{ status: boolean }>(`feature/${featureID}`).then(({ status }) => status),

  find: () => fetch.get<string[]>('features'),
};

export default featureClient;
