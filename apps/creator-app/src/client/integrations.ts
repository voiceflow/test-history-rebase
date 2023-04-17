import fetch from './fetch';

const integrationsClient = {
  getZapierToken: () => fetch.get<{ key: string }>('api/token'),
};

export default integrationsClient;
