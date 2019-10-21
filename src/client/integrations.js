import fetch from './fetch';

const integrationsClient = {
  getZapierToken: () => fetch.get('api/token').then((res) => res),
};

export default integrationsClient;
